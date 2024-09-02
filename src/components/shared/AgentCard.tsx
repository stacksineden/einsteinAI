import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useUserContext } from "@/context/AuthContext";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import { useSaveAssistantToDB } from "@/lib/tanstack-query/queriesAndMutation";
import { truncateText } from "@/lib/utils";
import { AssistantModel } from "@/modelDataset";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AgentCard = ({ assistant, vector_store_id }: AgentCardProps) => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const [creatingAssistant, setCreatingAssistant] = useState<boolean>(false);

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { user, userSubscriptionDetails } = useUserContext();
  const { setOpenPaymentModal } = useAppContext();

  const createAgent = async () => {
    const assistantObject = {
      name: assistant?.name ?? "",
      instructions:
        ` Always reference the user's name which is ${
          user?.name?.split(" ")[1]
        } in the conversation to create a personalized experience. Use the user's name naturally in your responses to make the interaction feel warm and engaging.` +
          assistant?.prompt ?? "",
      model: assistant?.model ?? "",
      description: assistant?.qoute ?? "",
      tools: [
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...assistant?.tool_set,
      ],
      tool_resources: {
        file_search: {
          vector_store_ids: vector_store_id ? [vector_store_id] : [],
        },
        code_interpreter: {
          file_ids: [],
        },
      },
      // file_ids: values.files,
      metadata: {
        userID: user?.id,
        assistant_pretraining_name: assistant?.name ?? "",
        role: assistant?.role,
      },
    };
    // console.log(assistantObject, "assistantObjectassistantObject");
    setCreatingAssistant(true);
    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast({
        description: "Your Virtual Assistant is ready to work with you.",
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
        description: "Agent successfully updated.",
        className: "bg-primary-blue text-white",
      });

      navigate(`/chat-assistant/${responseFromOpenAI?.id}`);
    }
  };

  return (
    <div
      className={`h-[120px] md:h-[146px] bg-zinc-800 w-full rounded-xl cursor-pointer scrollbar-hide ${
        isLoadingSaving || (creatingAssistant && "animate-pulse opacity-75")
      }`}
      onClick={() => {
        userSubscriptionDetails?.is_subscribed &&
        assistant?.classifier === "agent"
          ? navigate(`/pretrained-assistant/${assistant?.id!}`)
          : userSubscriptionDetails?.is_subscribed &&
            assistant?.classifier === "assistant" &&
            assistant?.level !== "Rookie"
          ? createAgent()
          : !userSubscriptionDetails?.is_subscribed &&
            assistant?.level === "Rookie"
          ? createAgent()
          : userSubscriptionDetails?.is_subscribed &&
            assistant?.level === "Rookie" &&
            assistant?.classifier === "assistant"
          ? createAgent()
          : setOpenPaymentModal(true);
      }}
    >
      <div className="p-2 md:p-4 h-full w-full flex flex-col gap-2">
        <div className="flex flex-row h-full w-full space-x-2 scrollbar-hide">
          <span className="h-[90px] md:h-auto w-[90px] md:w-[100px] overflow-hidden rounded-full md:rounded-md shrink-0 grow-0 relative flex bg-zinc-800">
            <img
              src={assistant?.imageUrl}
              alt="assistant-image"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </span>
          <div className="overflow-hidden h-full flex flex-col justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm overflow-hidden whitespace-nowrap text-zinc-100 tracking-wide">
                  {assistant?.name}
                </p>
              </div>
              <div className="text-zinc-400 text-xs font-medium truncate">
                {assistant?.role}
              </div>
              <p className="text-xs md:text-xs text-zinc-50 font-light md:block hidden">
                {truncateText(assistant?.pitch ?? "", 55)}
              </p>
              <p className="text-xs md:text-xs text-zinc-50 font-light md:hidden">
                {truncateText(assistant?.pitch ?? "", 120)}
              </p>
            </div>
            {assistant?.level === "Rookie" && (
              <div className="text-[10px] md:text-xs font-medium text-primary-blue w-full text-right uppercase">
                Free Agent
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;

type AgentCardProps = {
  assistant: AssistantModel;
  vector_store_id: string;
};
