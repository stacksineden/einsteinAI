import { useAppContext } from "@/context/AppContext";
import { useUserContext } from "@/context/AuthContext";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import { AssistantModel } from "@/modelDataset";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSaveAssistantToDB } from "@/lib/tanstack-query/queriesAndMutation";

const ToolsCard = ({ assistant, vector_store_id }: ToolsCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { user, userSubscriptionDetails } = useUserContext();
  const { setOpenPaymentModal } = useAppContext();

  const createTool = async () => {
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

    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast({
        description: "Your Virtual Assistant is ready to work with you.",
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
        description: "Agent successfully updated.",
        className: "bg-primary-blue text-white",
      });

      navigate(`/chat-assistant/${responseFromOpenAI?.id}`);
    }
  };

  return (
    <div
      className={`h-[90px] md:h-[90px] bg-zinc-800 w-full rounded-xl cursor-pointer ${
        isLoadingSaving && "animate-pulse opacity-75"
      }`}
      onClick={() => {
        userSubscriptionDetails?.is_subscribed
          ? createTool()
          : setOpenPaymentModal(true);
      }}
    >
      <div className="p-3 md:p-4 h-full w-full flex flex-col gap-2">
        <div className="flex flex-row h-full w-full space-x-2 scrollbar-hide">
          <span className="h-[40px] md:h-[60px] w-[40px] md:w-[60px] overflow-hidden rounded-full md:rounded-md shrink-0 grow-0 relative flex bg-zinc-800">
            <img
              src={assistant?.imageUrl}
              alt="assistant-image"
              className="object-cover w-full h-full rounded-full"
              loading="lazy"
            />
          </span>
          <div className="overflow-hidden h-full flex flex-col justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-xs md:text-sm overflow-hidden text-zinc-100 tracking-wide">
                {assistant?.pitch}
              </p>
              <div className="text-zinc-400 text-[10px] md:text-xs font-medium truncate">
                {`With ${assistant?.name}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsCard;

type ToolsCardProps = {
  assistant: AssistantModel;
  vector_store_id: string;
};
