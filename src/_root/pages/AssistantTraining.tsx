import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Container from "@/components/shared/Container";
import { getLevelColor, truncateText } from "@/lib/utils";
import { AssistantModel, dataSet } from "@/modelDataset";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { CreateAssistantValidationSchema } from "@/lib/validation";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/shared/Loader";
import {
  useGetUserFiles,
  useSaveAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";
// import { findSpecializedfunctionByKeyWord } from "@/specialisedFunctions";
import { useToast } from "@/components/ui/use-toast";

const AssistantTraining = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldSelectFiles, setShouldSelectFiles] = useState(false);

  const navigate = useNavigate();

  const { user, userSubscriptionDetails } = useUserContext();

  const { toast } = useToast();

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { id } = useParams();
  const assistantTrainingObject = dataSet?.filter(
    (assistant: AssistantModel) => assistant?.id === id
  );

  const {
    data: files,
    isPending: isFilesLoading,
    isError: isErrorFiles,
  } = useGetUserFiles(user?.id);

  // console.log(files?.documents, "files");

  // console.log(assistantTrainingObject);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof CreateAssistantValidationSchema>>({
    resolver: zodResolver(CreateAssistantValidationSchema),
    defaultValues: {
      alt_name: `${assistantTrainingObject[0]?.name}`,
      alt_prompt: `${assistantTrainingObject[0]?.prompt}`,
      is_selecting_files: false,
      is_code_interpreter: false,
      files: [],
      model: "gpt-3.5-turbo-1106",
      description: "",
    },
  });

  const { watch } = form;

  const watchIsSelectingFiles = watch("is_selecting_files", false);

  useEffect(() => {
    setShouldSelectFiles(watchIsSelectingFiles);
  }, [watchIsSelectingFiles]);

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof CreateAssistantValidationSchema>
  ) {
    // console.log(values, "form values");

    //i need to find a way to dynamically add function types. not all assistants have the same functions sets
    const assistantObject = {
      name: values.alt_name,
      instructions: values.alt_prompt,
      model: values.model,
      description: values.description,
      tools: [
        ...(values.is_code_interpreter ? [{ type: "code_interpreter" }] : []),
        ...(values.is_selecting_files ? [{ type: "retrieval" }] : []),
        ...assistantTrainingObject[0]?.tool_set,
      ],
      file_ids: values.files,
      metadata: {
        userID: user?.id,
        assistant_pretraining_name: assistantTrainingObject[0]?.name,
        role: assistantTrainingObject[0]?.role,
      },
    };
    console.log(
      assistantObject,
      "assistantObjectassistantObjectassistantObject"
    );
    // create an assistant with openAI
    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast({
        description: "Your Assistant is successfully created.",
        className: "bg-primary-blue text-white",
      });
    }
    if (!responseFromOpenAI) {
      toast({
        title: "Something went wrong!",
        description: "Please try again",
        className: "bg-red-200 text-white",
      });
    }

    const assistantToBeSaved = {
      id: user?.id,
      assistant_id: responseFromOpenAI?.id,
      instructions: responseFromOpenAI?.instructions,
      assistant_pretraining_name:
        responseFromOpenAI?.metadata?.assistant_pretraining_name,
      name: responseFromOpenAI?.name,
      role: responseFromOpenAI?.metadata?.role,
    };
    // console.log(assistantToBeSaved, "assistantToBeSaved");

    const newAssistant = await saveAssistant(assistantToBeSaved);
    if (!newAssistant) {
      return toast({
        title: "Unable to save assistant!",
        description: "Please try again",
        className: "bg-red-200 text-white",
      });
    }

    if (newAssistant) {
      toast({
        description: "Your Assistant is successfully saved.",
        className: "bg-primary-blue text-white",
      });
    }

    //handle redirection
    navigate("/my-assistants");
  }

  return (
    <Container>
      <div className="w-full mt-0 md:mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="w-full p-4 flex flex-col gap-3  shadow-md">
          <h2 className="text-primary-black text-xl md:text-3xl font-medium">
            {assistantTrainingObject[0]?.pitch || ""}
          </h2>
          <div className="flex items-center gap-5 border-t border-t-light-grey py-2 px-3">
            <p className="text-sm md:text-base text-primary-black opacity-60 font-medium">
              114K Hires
            </p>
            <div
              className={`text-xs font-semibold ${getLevelColor(
                assistantTrainingObject[0]?.level!
              )} bg-light-grey py-1 px-2 rounded-md uppercase`}
            >
              {assistantTrainingObject[0]?.level || ""}
            </div>
          </div>
          <div className="flex gap-1 md:gap-2">
            <div className="rounded-full overflow-hidden shadow-lg bg-light-grey w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
              <img
                src={
                  assistantTrainingObject[0]?.imageUrl ||
                  "/assets/images/assistants/placeholder.png"
                }
                alt="assistantimage"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col py-4 flex-[70%] w-full">
              <h2 className="text-primary-black font-medium text-lg md:text-2xl tracking-wide">
                {assistantTrainingObject[0]?.name || ""}
              </h2>
              <div className="text-base md:text-lg text-primary-blue font-medium">
                {assistantTrainingObject[0]?.role || ""}
              </div>
              <p className="text-primary-black text-xs md:text-sm font-light opacity-70">{` "${
                assistantTrainingObject[0]?.qoute || ""
              }" `}</p>
            </div>
          </div>

          <div className="text-primary-black font-normal text-xs md:text-sm mt-0 md:mt-2">
            {isExpanded
              ? assistantTrainingObject[0]?.assistant_description
              : truncateText(
                  assistantTrainingObject[0]?.assistant_description,
                  400
                )}
            {assistantTrainingObject[0]?.assistant_description?.length >
              400 && (
              <button
                className="text-primary-black cursor-pointer underline ml-2 font-medium"
                onClick={toggleExpansion}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
          <div className="mt-2 bg-light-grey p-4 rounded-lg shadow-md">
            <h2 className="text-primary-black font-medium text-sm md:text-base">
              Proficiencies:
            </h2>
            <div className="mt-2 space-y-2">
              {assistantTrainingObject[0]?.capabilities?.map(
                (capability, _i) => (
                  <div
                    className="flex items-center justify-start gap-1 text-sm md:text-base"
                    key={_i}
                  >
                    <BadgeCheck className="h-5 w-5 text-primary-blue" />
                    <div className="flex-[80%] w-full"> {capability}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col p-4 md:p-7">
          <h2 className="text-primary-blue text-xl md:text-2xl font-medium">
            {`Train ${assistantTrainingObject[0]?.name}`}
          </h2>
          <p className="text-xs md:text-sm font-normal text-primary-yellow mt-2">
            Configure your assistant settings below. You have the option to
            customize the assistant name and prompt, or you can stick with the
            pre-configured details provided by us. Feel free to personalize your
            assistant by giving it a unique name, or simply proceed with the
            default settings.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full mt-4"
            >
              <FormField
                control={form.control}
                name="alt_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Assistant Name (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={`${assistantTrainingObject[0]?.name}`}
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={`Give your assistant a brief description`}
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alt_prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Instructions
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={`${assistantTrainingObject[0]?.prompt}`}
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_selecting_files"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Assistant files
                      </FormLabel>
                      <FormDescription>
                        Do you have files you want to train{" "}
                        {assistantTrainingObject[0]?.name} on?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {shouldSelectFiles && (
                <FormField
                  control={form.control}
                  name="files"
                  render={() => (
                    <FormItem>
                      <div className="mb-4 mx-1">
                        <FormLabel className="text-base">Your Files</FormLabel>
                        <FormDescription>
                          Select the files you want to have your assistant
                          trained on or{" "}
                          <Link
                            className="text-primary-blue text-sm cursor-pointer"
                            to="/files"
                          >
                            Upload file
                          </Link>
                          .
                          {isErrorFiles && (
                            <span className="text-primary-red text-sm">
                              Error fetching files. Try again later.
                            </span>
                          )}
                          {files?.documents?.length === 0 && (
                            <span>
                              You don't have any files.{" "}
                              <span className="text-primary-blue cursor-pointer text-sm">
                                Upload file
                              </span>
                              .
                            </span>
                          )}
                          {isFilesLoading && (
                            <div className="text-primary-blue">
                              Loading files...
                            </div>
                          )}
                        </FormDescription>
                      </div>
                      {files?.documents &&
                        files?.documents?.length !== 0 &&
                        files?.documents.map((file) => (
                          <FormField
                            key={file.$id}
                            control={form.control}
                            name="files"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={file.$id}
                                  className="flex flex-row items-center space-x-3 space-y-1 mx-1 rounded-md p-2 border border-light-grey"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        file.fileId
                                      )}
                                      onCheckedChange={(checked) => {
                                        field.onChange(
                                          checked
                                            ? [...field.value, file.fileId]
                                            : field.value?.filter(
                                                (value) => value !== file.fileId
                                              )
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-light text-primary-black text-xs md:text-sm tracking-wide">
                                    {file.fileName}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="is_code_interpreter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Turn on code interpreter for{" "}
                        {assistantTrainingObject[0]?.name}? (Optional)
                      </FormLabel>
                      <FormDescription className="text-sm font-light w-[90%]">
                        Code Interpreter enables the assistant to write and run
                        code. This tool can process files with diverse data and
                        formatting, and generate files such as graphs.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* specilizsed functions */}
              <div className="my-1 mx-1">
                <h2 className="text-primary-black font-medium text-base">
                  Specialized functions for {assistantTrainingObject[0]?.name}:
                </h2>
                <div className="mt-2 space-y-2">
                  {assistantTrainingObject[0]?.specialized_function?.map(
                    (capability, _i) => (
                      <div
                        className="flex items-center justify-start gap-1 text-sm md:text-base"
                        key={_i}
                      >
                        <BadgeCheck className="h-5 w-5 text-primary-blue" />
                        <div className="flex-[80%] w-full"> {capability}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {userSubscriptionDetails?.is_subscribed &&
              assistantTrainingObject[0]?.level !== "Rookie" ? (
                <Button
                  type="submit"
                  className="shad-button_primary"
                  disabled={isLoadingSaving}
                >
                  {isLoadingSaving ? (
                    <div className="flex-center gap-2">
                      <Loader /> Creating Assistant ...
                    </div>
                  ) : (
                    "Create Assistant"
                  )}
                </Button>
              ) : userSubscriptionDetails?.is_subscribed &&
                assistantTrainingObject[0]?.level === "Rookie" ? (
                <Button
                  type="submit"
                  className="shad-button_primary"
                  disabled={isLoadingSaving}
                >
                  {isLoadingSaving ? (
                    <div className="flex-center gap-2">
                      <Loader /> Creating Assistant ...
                    </div>
                  ) : (
                    "Create Assistant"
                  )}
                </Button>
              ) : !userSubscriptionDetails?.is_subscribed &&
                assistantTrainingObject[0]?.level === "Rookie" ? (
                <Button
                  type="submit"
                  className="shad-button_primary"
                  disabled={isLoadingSaving}
                >
                  {isLoadingSaving ? (
                    <div className="flex-center gap-2">
                      <Loader /> Creating Assistant ...
                    </div>
                  ) : (
                    "Create Assistant"
                  )}
                </Button>
              ) : !userSubscriptionDetails?.is_subscribed &&
                assistantTrainingObject[0]?.level !== "Rookie" ? (
                <Link
                  to={"/account"}
                  className="text-center p-2 bg-primary-black text-white" 
                >
                  Upgrade to Train
                </Link>
              ) : (
                <Link
                  to={"/account"}
                  className="text-center p-2 bg-primary-black text-white"
                >
                  Upgrade to Train
                </Link>
              )}
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AssistantTraining;
