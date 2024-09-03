import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  retrieveAssistantOpenAI,
  updateAssistantOpenAI,
} from "@/lib/openAI/api";
import { Input } from "@/components/ui/input";
import { AssistantModel, dataSet, getImageUrlByName } from "@/modelDataset";
import { getAssistantLevel, getLevelColor } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { BadgeCheck, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditAssistantValidationSchema } from "@/lib/validation";
import {
  useGetUserVectorStoreDetails,
  useUpdateAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import Skeleton from "react-loading-skeleton";
import Loader from "@/components/shared/Loader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const UpdateAssistant = () => {
  const { id, docid } = useParams();
  const { user } = useUserContext();
  const [creatingAssistant, setCreatingAssistant] = useState<boolean>(false);

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  //get assistants-details from open ai
  // const [isExpanded, setIsExpanded] = useState(false);
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});

  const { mutateAsync: updateAssistant, isPending: isLoadingUpdating } =
    useUpdateAssistantToDB();

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
    setAssistantObject(data);
  };

  useEffect(() => {
    getAssistantInfo(id!);
  }, [id]);

  // const toggleExpansion = () => {
  //   setIsExpanded(!isExpanded);
  // };

  // 1. Define your form.
  const form = useForm<z.infer<typeof EditAssistantValidationSchema>>({
    resolver: zodResolver(EditAssistantValidationSchema),
    defaultValues: {
      alt_name: ``,
      alt_prompt: ``,
      description: "",
    },
  });

  useEffect(() => {
    form.setValue("alt_name", assistantObject?.name || "");
    form.setValue("description", assistantObject?.description || "");
    form.setValue("alt_prompt", assistantObject?.instructions || "");
  }, [assistantObject, form]);

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
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...getFunctionToolSets(
          assistantObject?.metadata?.assistant_pretraining_name!
        ),
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
    };
    setCreatingAssistant(true);

    const responseFromOpenAI = await updateAssistantOpenAI(
      id!,
      assistantObjectTobeUpdated
    );

    if (responseFromOpenAI) {
      toast.success("Your Assistant is successfully updated.");
    }
    if (!responseFromOpenAI) {
      setCreatingAssistant(false);
      toast.error("Assistant Update failed.");
    }
    const assistantToBeSaved = {
      id: docid!,
      instructions: responseFromOpenAI?.instructions,
      name: responseFromOpenAI?.name,
    };

    const savedAssistant = await updateAssistant(assistantToBeSaved);

    if (savedAssistant instanceof Error) {
      // Assuming err.message contains the API error message
      setCreatingAssistant(false);
      return toast.error(
        savedAssistant?.message || "Unable to save assistant, please try again."
      );
    }

    if (savedAssistant) {
      setCreatingAssistant(false);
      toast.success("Your Assistant is successfully saved.");
    }

    //handle redirection
    navigate("/my-assistants");
  }

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col px-4 sm:px-8 pt-6">
        <div className="max-w-7xl self-center w-full">
          <div className="mt-0 md:mt-2 flex justify-end md:justify-between gap-4 border-b border-gray-700 pb-5 items-center px-3 md:px-4">
            <h1 className="mb-3 font-bold text-xl md:text-3xl text-zinc-100 hidden md:block">
              Update Assistant
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
              {assistantObject?.description || <Skeleton height={80} />}
            </h2>
            <div className="flex items-center gap-5 border-t border-t-zinc-800 py-2 px-3">
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
                    <p className="text-sm text-zinc-100">{`See tools for ${
                      assistantObject?.metadata?.assistant_pretraining_name! ||
                      ""
                    }`}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <div className="text-zinc-400 font-normal text-xs md:text-sm mt-0 md:mt-2">
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
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-1 md:gap-2">
              <div className="rounded-full overflow-hidden shadow-lg bg-light-grey w-[100px] h-[100px]">
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
              <div className="flex flex-col py-4 w-full">
                <h2 className="text-zinc-100 font-medium text-lg md:text-2xl tracking-wide">
                  {assistantObject?.name! || <Skeleton height={30} />}
                </h2>
                <div className="text-base md:text-lg text-primary-blue font-medium">
                  {assistantObject?.metadata?.role || <Skeleton height={30} />}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:p-7">
            <h2 className="text-primary-blue text-xl md:text-2xl font-medium">
              {`Train ${assistantObject?.name!}`}
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
                        <Textarea
                          placeholder={`${
                            assistantObject?.instructions! ||
                            "Assistant Instructions"
                          }`}
                          className="shad-textarea"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="shad-button_primary"
                  disabled={isLoadingUpdating || creatingAssistant}
                >
                  {isLoadingUpdating || creatingAssistant ? (
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
      </div>
    </div>
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
