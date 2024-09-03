import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { truncateText } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { AssistantModel } from "@/modelDataset";
import { useSaveAssistantToDB } from "@/lib/tanstack-query/queriesAndMutation";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import toast from "react-hot-toast";

let interval: any;

export const CardStack = ({
  items,
  offset,
  scaleFactor,
  vector_store_id,
}: {
  items: AssistantModel[];
  offset?: number;
  scaleFactor?: number;
  vector_store_id: string;
}) => {
  const navigate = useNavigate();
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<AssistantModel[]>(items);

  const { user, userSubscriptionDetails } = useUserContext();
  const { setOpenPaymentModal } = useAppContext();

  const { mutateAsync: saveAssistant } = useSaveAssistantToDB();

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: AssistantModel[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 8000);
  };

  const createAssistant = async (card: AssistantModel) => {
    const assistantObject = {
      name: card?.name ?? "",
      instructions:
        ` Always reference the user's name which is ${
          user?.name?.split(" ")[1]
        } in the conversation to create a personalized experience. Use the user's name naturally in your responses to make the interaction feel warm and engaging.` +
          card?.prompt ?? "",
      model: card?.model ?? "",
      description: card?.qoute ?? "",
      tools: [
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...card?.tool_set,
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
        assistant_pretraining_name: card?.name ?? "",
        role: card?.role,
      },
    };
    // console.log(assistantObject, "assistantObjectassistantObject");

    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);

    if (responseFromOpenAI) {
      toast.success("Your Virtual Assistant is ready to work with you.");
    }
    if (!responseFromOpenAI) {
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
      return toast.error(
        newAssistant?.message || "Unable to save assistant, please try again."
      );
    }

    if (newAssistant) {
      toast.success("Assistant successfully Created.");

      navigate(`/chat-assistant/${responseFromOpenAI?.id}`);
    }
  };

  return (
    <div className="relative h-full w-full">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={`absolute bg-black h-full w-full rounded-2xl p-4 shadow-xl border border-zinc-900  shadow-black/[0.1] hover:bg-zinc-900 transition-all ease-out duration-500 flex flex-col justify-between cursor-pointer`}
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            onClick={() => {
              userSubscriptionDetails?.is_subscribed && card?.level !== "Rookie"
                ? createAssistant(card)
                : !userSubscriptionDetails?.is_subscribed &&
                  card?.level === "Rookie"
                ? createAssistant(card)
                : userSubscriptionDetails?.is_subscribed &&
                  card?.level === "Rookie"
                ? createAssistant(card)
                : setOpenPaymentModal(true);
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-zinc-100">
                <img
                  src={card.imageUrl}
                  alt="assistant"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-zinc-500 font-medium">{card.name}</p>
                <p className="text-zinc-400 font-normal">{card.role}</p>
              </div>
            </div>
            <div className="font-normal text-zinc-500 text-base">
              {truncateText(card.pitch ?? "", 100)}
            </div>
            {card?.level === "Rookie" && (
              <div className="hidden md:block text-xs font-medium text-primary-blue w-full text-right uppercase">
                Free Agent
              </div>
            )}
            <div className="flex items-center gap-1">
              <p className="font-medium text-zinc-100">Chat</p>
              <MessageCircle className="h-5 w-5 text-primary-blue" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
