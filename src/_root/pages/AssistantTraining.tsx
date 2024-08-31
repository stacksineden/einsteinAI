import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLevelColor, truncateText } from "@/lib/utils";
import { AssistantModel, dataSet } from "@/modelDataset";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Info } from "lucide-react";
import { CreateAssistantValidationSchema } from "@/lib/validation"; 
import Loader from "@/components/shared/Loader";
import {
  useGetUserVectorStoreDetails,
  useSaveAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const AssistantTraining = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [creatingAssistant, setCreatingAssistant] = useState<boolean>(false);

  const navigate = useNavigate();

  const { user, userSubscriptionDetails } = useUserContext();

  const { toast } = useToast();

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { id } = useParams();
  const assistantTrainingObject = dataSet?.filter(
    (assistant: AssistantModel) => assistant?.id === id 
  );

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof CreateAssistantValidationSchema>>({
    resolver: zodResolver(CreateAssistantValidationSchema),
    defaultValues: {
      alt_name: `${assistantTrainingObject[0]?.name}`,
      alt_prompt: `${assistantTrainingObject[0]?.prompt}`,
      model: assistantTrainingObject[0]?.model
        ? assistantTrainingObject[0]?.model
        : "gpt-3.5-turbo-1106",
      description: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof CreateAssistantValidationSchema>
  ) {
    //i need to find a way to dynamically add function types. not all assistants have the same functions sets
    const assistantObject = {
      name: values.alt_name,
      instructions:
        ` Always reference the user's name which is ${
          user?.name?.split(" ")[1]
        } in the conversation to create a personalized experience. Use the user's name naturally in your responses to make the interaction feel warm and engaging.` +
        values.alt_prompt,
      model: values.model,
      description: values.description,
      tools: [
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...assistantTrainingObject[0]?.tool_set,
      ],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore?.documents[0]?.vector_store_id],
        },
        code_interpreter: {
          file_ids: [],
        },
      },
      // file_ids: values.files,
      metadata: {
        userID: user?.id,
        assistant_pretraining_name: assistantTrainingObject[0]?.name,
        role: assistantTrainingObject[0]?.role,
      },
    };
    // create an assistant with openAI
    setCreatingAssistant(true);
    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast({
        description: "Your Assistant is successfully created.",
        className: "bg-primary-blue text-white",
      });
    }
    if (!responseFromOpenAI) {
      setCreatingAssistant(false);
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

    const newAssistant = await saveAssistant(assistantToBeSaved);

    if (newAssistant instanceof Error) {
      // Assuming err.message contains the API error message
      setCreatingAssistant(false);
      return toast({
        title:
          newAssistant?.message ||
          "Unable to save assistant, please try again.",
        className: "bg-primary-red text-white",
      });
    }

    if (newAssistant) {
      setCreatingAssistant(false);
      toast({
        description: "Your Assistant is successfully saved.",
        className: "bg-primary-blue text-white",
      });
    }

    //handle redirection
    navigate(`/chat-assistant/${responseFromOpenAI?.id}`);
  }

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col px-4 sm:px-8 pt-6">
        <div className="max-w-7xl self-center w-full">
          <div className="mt-0 md:mt-2 flex justify-end md:justify-between gap-4 border-b border-gray-700 pb-5 items-center px-3 md:px-4">
            <h1 className="mb-3 font-bold text-xl md:text-3xl text-zinc-100 hidden md:block">
              Train Assistant
            </h1>
            <Button
              className={buttonVariants({
                size: "lg",
                className: "bg-primary-black text-white rounded-md",
              })}
              onClick={() => navigate("/files")}
            >
              My Files
            </Button>
          </div>
        </div>
        <div className="mt-4 md:mt-8 px-3">
          <div className="w-full md:p-4 flex flex-col gap-3 shadow-lg">
            <h2 className="text-zinc-100 text-xl md:text-3xl font-medium">
              {assistantTrainingObject[0]?.pitch || ""}
            </h2>
            <div className="flex items-center gap-5 border-t border-t-zinc-800 py-2 px-3">
              <div
                className={`text-xs font-semibold ${getLevelColor(
                  assistantTrainingObject[0]?.level!
                )} bg-light-grey py-1 px-2 rounded-md uppercase`}
              >
                {assistantTrainingObject[0]?.level || ""}
              </div>
              <Dialog
                open={isOpen}
                onOpenChange={(visible) => {
                  if (!visible) {
                    setIsOpen(visible);
                  }
                }}
              >
                <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                  <div className="p-2 flex items-center gap-1 cursor-pointer">
                    <Info className="w-5 h-5 text-primary-blue" />
                    <p className="text-sm text-zinc-100">{`See more info about ${
                      assistantTrainingObject[0]?.name || ""
                    }`}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <div className="text-zinc-400 font-normal text-xs md:text-sm mt-0 md:mt-2">
                    {isExpanded
                      ? assistantTrainingObject[0]?.assistant_description
                      : truncateText(
                          assistantTrainingObject[0]?.assistant_description,
                          400
                        )}
                    {assistantTrainingObject[0]?.assistant_description?.length >
                      400 && (
                      <button
                        className="text-primary-blue cursor-pointer underline ml-2 font-medium"
                        onClick={toggleExpansion}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                    <div className="mt-2 p-4 rounded-lg shadow-md">
                      <h2 className="text-zinc-100 font-medium text-sm md:text-base">
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
                              <div className="flex-[80%] w-full">
                                {" "}
                                {capability}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-1 md:gap-2">
              <div className="rounded-full overflow-hidden shadow-lg bg-light-grey w-[100px] h-[100px]">
                <img
                  src={
                    assistantTrainingObject[0]?.imageUrl ||
                    "/assets/images/assistants/placeholder.png"
                  }
                  alt="assistantimage"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col py-4 w-full">
                <h2 className="text-zinc-100 font-medium text-lg md:text-2xl tracking-wide">
                  {assistantTrainingObject[0]?.name || ""}
                </h2>
                <div className="text-base md:text-lg text-primary-blue font-medium">
                  {assistantTrainingObject[0]?.role || ""}
                </div>
                <p className="text-zinc-300 text-xs md:text-sm font-light opacity-70">{` ${
                  assistantTrainingObject[0]?.qoute || ""
                } `}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:p-7">
            <h2 className="text-primary-blue text-xl md:text-2xl font-medium">
              {`Train ${assistantTrainingObject[0]?.name}`}
            </h2>
            <p className="text-xs font-normal text-primary-yellow mt-2">
              Configure your assistant settings below. You have the option to
              customize the assistant name and prompt, or you can stick with the
              pre-configured details provided by us. Feel free to personalize
              your assistant by giving it a unique name, or simply proceed with
              the default settings.
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

                {/* specilizsed functions */}
                <div className="my-1 mx-1">
                  <h2 className="text-zinc-100 font-medium text-base">
                    Specialized functions for {assistantTrainingObject[0]?.name}
                    :
                  </h2>
                  <div className="mt-2 space-y-2">
                    {assistantTrainingObject[0]?.specialized_function?.map(
                      (capability, _i) => (
                        <div
                          className="flex items-center justify-start gap-1 text-sm md:text-base"
                          key={_i}
                        >
                          <BadgeCheck className="h-5 w-5 text-primary-blue" />
                          <div className="flex-[80%] w-full text-zinc-100">
                            {" "}
                            {capability}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="text-sm text-primary-red font-medium">
                  Please note that assistants generating images have a 1-hour
                  expiration time for the image generations. Please download and
                  utilize these images before they expire.
                </div>
                {userSubscriptionDetails?.is_subscribed &&
                assistantTrainingObject[0]?.level !== "Rookie" ? (
                  <Button
                    type="submit"
                    className="shad-button_primary"
                    disabled={isLoadingSaving || creatingAssistant}
                  >
                    {isLoadingSaving || creatingAssistant ? (
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
                    disabled={isLoadingSaving || creatingAssistant}
                  >
                    {isLoadingSaving || creatingAssistant ? (
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
                    disabled={isLoadingSaving || creatingAssistant}
                  >
                    {isLoadingSaving || creatingAssistant ? (
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
      </div>
    </div>
  );
};

export default AssistantTraining;
