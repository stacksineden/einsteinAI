import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "@/components/shared/Container";
import {
  retrieveAssistantOpenAI,
  updateAssistantOpenAI,
} from "@/lib/openAI/api";
import { Input } from "@/components/ui/input";
import { AssistantModel, dataSet, getImageUrlByName } from "@/modelDataset";
import { getAssistantLevel, getLevelColor, truncateText } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditAssistantValidationSchema } from "@/lib/validation";
import {
  useGetUserFiles,
  useUpdateAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import Skeleton from "react-loading-skeleton";
import Loader from "@/components/shared/Loader";

const UpdateAssistant = () => {
  const { id, docid } = useParams();
  const { user } = useUserContext();
  const { toast } = useToast();

  const navigate = useNavigate();

  //get assistants-details from open ai
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldSelectFiles, setShouldSelectFiles] = useState(false);
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});

  const { mutateAsync: updateAssistant, isPending: isLoadingUpdating } =
    useUpdateAssistantToDB();

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
    setAssistantObject(data);
  };

  useEffect(() => {
    getAssistantInfo(id!);
  }, [id]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  //get user files
  const {
    data: files,
    isPending: isFilesLoading,
    isError: isErrorFiles,
  } = useGetUserFiles(user?.id);

  // console.log(assistantObject, "assistantObject");

  // 1. Define your form.
  const form = useForm<z.infer<typeof EditAssistantValidationSchema>>({
    resolver: zodResolver(EditAssistantValidationSchema),
    defaultValues: {
      alt_name: ``,
      alt_prompt: ``,
      is_selecting_files: false,
      is_code_interpreter: false,
      files: [],
      description: "",
    },
  });

  useEffect(() => {
    form.setValue("alt_name", assistantObject?.name || "");
    form.setValue("description", assistantObject?.description || "");
    form.setValue("alt_prompt", assistantObject?.instructions || "");
    form.setValue(
      "is_selecting_files",
      assistantObject?.file_ids?.length !== 0
    );
    form.setValue("files", assistantObject?.file_ids || []);
    form.setValue(
      "is_code_interpreter",
      assistantObject?.tools?.some(
        (tool) => tool?.type === "code_interpreter"
      ) || false
    );
  }, [assistantObject, form]);

  const { watch } = form;

  const watchIsSelectingFiles = watch("is_selecting_files", false);

  useEffect(() => {
    setShouldSelectFiles(watchIsSelectingFiles);
  }, [watchIsSelectingFiles]);

  //get toolsets for assistants

  const getFunctionToolSets = (assistant_name: string) => {
    const assistant = dataSet?.filter(
      (assistant: AssistantModel) => assistant?.name === assistant_name
    );
    return assistant[0]?.tool_set;
  };

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof EditAssistantValidationSchema>
  ) {
    const assistantObjectTobeUpdated = {
      name: values.alt_name,
      instructions: values.alt_prompt,
      description: values.description,
      tools: [
        ...(values.is_code_interpreter ? [{ type: "code_interpreter" }] : []),
        ...(values.is_selecting_files ? [{ type: "retrieval" }] : []),
        ...getFunctionToolSets(
          assistantObject?.metadata?.assistant_pretraining_name!
        ),
      ],
      file_ids: values.files,
    };

    // console.log(assistantObject, "assistantObjectassistantObject");
    const responseFromOpenAI = await updateAssistantOpenAI(
      id!,
      assistantObjectTobeUpdated
    );
    console.log(responseFromOpenAI, "responseFromOpenAI");
    if (responseFromOpenAI) {
      toast({
        description: "Your Assistant is successfully updated.",
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
      id: docid!,
      instructions: responseFromOpenAI?.instructions,
      name: responseFromOpenAI?.name,
    };

    const savedAssistant = await updateAssistant(assistantToBeSaved);
    if (!savedAssistant) {
      return toast({
        title: "Unable to save assistant!",
        description: "Please try again",
        className: "bg-red-200 text-white",
      });
    }

    if (savedAssistant) {
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
            {assistantObject?.description || <Skeleton height={80} />}
          </h2>
          <div className="flex items-center gap-5 border-t border-t-light-grey py-2 px-3">
            {/* <p className="text-sm md:text-base text-primary-black opacity-60 font-medium">
              114K Hires
            </p> */}
            <div
              className={`text-xs font-semibold bg-light-grey py-1 px-2 rounded-md uppercase ${getLevelColor(
                getAssistantLevel(
                  assistantObject?.metadata?.assistant_pretraining_name!
                )
              )}`}
            >
              {getAssistantLevel(
                assistantObject?.metadata?.assistant_pretraining_name ?? ""
              )}
            </div>
          </div>
          <div className="flex gap-1 md:gap-2">
            <div className="rounded-full overflow-hidden shadow-lg bg-light-grey w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
              <img
                src={
                  getImageUrlByName(
                    assistantObject?.metadata?.assistant_pretraining_name!
                  ) || "/assets/images/assistants/placeholder.png"
                }
                alt="assistantimage"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col py-4 flex-[70%] w-full">
              <h2 className="text-primary-black font-medium text-lg md:text-2xl tracking-wide">
                {assistantObject?.name! || <Skeleton height={30} />}
              </h2>
              <div className="text-base md:text-lg text-primary-blue font-medium">
                {assistantObject?.metadata?.role || <Skeleton height={30} />}
              </div>
              <p className="text-primary-black text-xs md:text-sm font-light opacity-70">{` "Hey, Let's keep it rolling!" `}</p>
            </div>
          </div>
          {/* <div className="text-primary-black font-normal text-xs md:text-sm mt-0 md:mt-2">
            {assistantObject && (
              <>
                {isExpanded
                  ? assistantObject.instructions
                  : truncateText(assistantObject.instructions || "", 400)}
                {assistantObject.instructions &&
                  assistantObject.instructions.length > 400 && (
                    <button
                      className="text-primary-black cursor-pointer underline ml-2 font-medium"
                      onClick={toggleExpansion}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
              </>
            )}
          </div> */}

          <div className="mt-2 bg-light-grey p-4 rounded-lg shadow-md">
            <h2 className="text-primary-black font-medium text-sm md:text-base">
              Tools:
            </h2>
            <div className="mt-2 space-y-2">
              {assistantObject?.tools?.map((capability, _i) => (
                <div
                  className="flex items-center justify-start gap-1 text-sm md:text-base"
                  key={_i}
                >
                  <BadgeCheck className="h-5 w-5 text-primary-blue" />
                  <div className="flex-[80%] w-full">
                    {" "}
                    {capability?.type === "function"
                      ? capability?.function?.name
                      : capability?.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col p-4 md:p-7">
          <h2 className="text-primary-blue text-xl md:text-2xl font-medium">
            {`Update Assistant`}
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
                        placeholder={`${
                          assistantObject?.name! || "Assistant Name"
                        }`}
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
                        placeholder={`${
                          assistantObject?.description ||
                          "Assistant Description"
                        }`}
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
                        placeholder={`${
                          assistantObject?.instructions! ||
                          "Assistant Instructions"
                        }`}
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
                        {assistantObject?.name} on?
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
                          Manage your assistant files or{" "}
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
                        Turn on code interpreter for {assistantObject?.name}?
                        (Optional)
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

              <Button type="submit" className="shad-button_primary">
                {isLoadingUpdating ? (
                  <div className="flex-center gap-2">
                    <Loader /> Saving changes ...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default UpdateAssistant;

type Tools = {
  type?: string;
  function?: {
    name?: string;
    description?: string;
  };
};

type IAssistant = {
  name?: string;
  role?: string;
  instructions?: string;
  file_ids?: string[];
  metadata?: {
    assistant_pretraining_name?: string;
    role?: string;
  };
  description?: string;
  tools?: Tools[];
};
