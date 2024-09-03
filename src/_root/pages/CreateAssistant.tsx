import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { FreeMode, Mousewheel } from "swiper/modules";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateAssistantValidationSchema } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  useGetUserVectorStoreDetails,
  useSaveAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import AvatarSlider from "@/components/shared/AvatarSlider";
import { create_agent_tool_set, emojiDictionary } from "@/modelDataset";
import { useAssistantCategoryContext } from "@/context/AssistantCategoryContext";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import toast from "react-hot-toast";

const CreateAssistant = () => {
  const navigate = useNavigate();

  const { user, userSubscriptionDetails } = useUserContext();

  const [creatingAssistant, setCreatingAssistant] = useState<boolean>(false);

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  const { selectedAvatar } = useAssistantCategoryContext();

  const form = useForm<z.infer<typeof CreateAssistantValidationSchema>>({
    resolver: zodResolver(CreateAssistantValidationSchema),
    defaultValues: {
      alt_name: ``,
      alt_prompt: ``,
      model: "",
      description: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof CreateAssistantValidationSchema>
  ) {
    if (!selectedAvatar) return toast.error("Select your Assistant Avatar");
    const assistantObject = {
      name: values.alt_name,
      instructions: values.alt_prompt,
      model: "gpt-4o",
      description: values.description,
      tools: [
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...create_agent_tool_set,
      ],
      tool_resources: {
        file_search: {
          vector_store_ids: vectorStore?.documents[0]?.vector_store_id
            ? [vectorStore?.documents[0]?.vector_store_id]
            : [],
        },
        code_interpreter: {
          file_ids: [],
        },
      },
      // file_ids: values.files,
      metadata: {
        userID: user?.id,
        assistant_pretraining_name: selectedAvatar,
        role: "My Assistant",
      },
    };

    // console.log(assistantObject, "assistantObject");
    // create an assistant with openAI
    setCreatingAssistant(true);
    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast.success("Your Assistant is successfully created.");
    }
    if (!responseFromOpenAI) {
      setCreatingAssistant(false);
      toast.error("Assistant Creation failed.");
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
      return toast.error(
        newAssistant?.message || "Unable to save assistant, please try again"
      );
    }

    if (newAssistant) {
      setCreatingAssistant(false);
      toast.success("Your Assistant is successfully saved.");
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
              Create Assistant
            </h1>
            <Button
              className={buttonVariants({
                size: "lg",
                className: "bg-primary-black text-white rounded-md",
              })}
              onClick={() => navigate("/my-assistants")}
            >
              My Assistants
            </Button>
          </div>
        </div>
        <div className="mt-4 md:mt-8 px-3">
          <div className="px-2 md:px-32 w-full">
            <p className="text-xs md:text-sm font-normal text-primary-blue mt-2">
              Configure your assistant settings below. Start by giving your
              assistant a unique name and setting a custom prompt. Personalize
              your assistant to make it truly yours from the beginning. Consider
              what kind of personality and tone you want your assistant to have.
              Will it be formal and professional, or casual and friendly? Think
              about the types of interactions it will handle and tailor its
              settings to best suit your needs. This is your chance to create an
              assistant that reflects your style and preferences.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 w-full mt-7 pb-4"
              >
                <div className="w-full flex flex-col gap-1">
                  <div className="text-zinc-100 font-medium">
                    Select your Assistant Avatar
                  </div>
                  <div className="my-4 relative w-full">
                    <AvatarSlider
                      key="slider1"
                      modules={[FreeMode, Mousewheel]}
                      data={emojiDictionary}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="alt_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        Assistant Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={"e.g John"}
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
                        <Textarea
                          placeholder="Enter your Prompt"
                          className="shad-textarea"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {userSubscriptionDetails?.is_subscribed ? (
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
                ) : (
                  <Button
                    type="submit"
                    className="shad-button_primary"
                    disabled={true}
                  >
                    Upgrade to Create Assistant
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssistant;
