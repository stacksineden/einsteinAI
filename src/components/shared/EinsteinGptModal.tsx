import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { einsteinGPTObject, einsteinGptFeatures } from "@/modelDataset";
import { CheckCheck } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { createAssistantOpenAI } from "@/lib/openAI/api";
import toast from "react-hot-toast";
import {
  useGetUserVectorStoreDetails,
  useSaveAssistantToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const EinsteinGptModal = ({ is_subscribed }: { is_subscribed: boolean }) => {
  const navigate = useNavigate();
  const [creatingAssistant, setCreatingAssistant] = useState<boolean>(false);

  const { openGptModal, setOpenGptModal } = useChatContext();
  const { user } = useUserContext();
  const { setOpenPaymentModal } = useAppContext();

  const { mutateAsync: saveAssistant, isPending: isLoadingSaving } =
    useSaveAssistantToDB();

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  const einsteinGPTAssiant = einsteinGPTObject;

  const createGPTAssistant = async () => {
    const assistantObject = {
      name: einsteinGPTAssiant?.name,
      instructions: einsteinGPTAssiant?.prompt,
      model: einsteinGPTAssiant?.model,
      description: einsteinGPTAssiant?.qoute,
      tools: [
        {
          type: "code_interpreter",
        },
        {
          type: "file_search",
        },
        ...einsteinGPTAssiant?.tool_set,
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
      metadata: {
        userID: user?.id,
        assistant_pretraining_name: einsteinGPTAssiant?.name,
        role: einsteinGPTAssiant?.role,
      },
    };

    setCreatingAssistant(true);
    const responseFromOpenAI = await createAssistantOpenAI(assistantObject);
    if (responseFromOpenAI) {
      toast.success("Your Virtual Assistant is ready to work with you.");
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
        newAssistant?.message || "Unable to save assistant, please try again."
      );
    }

    if (newAssistant) {
      setCreatingAssistant(false);
      toast.success("EinsteinGPT successfully updated.");

      navigate(`/einsteingpt/${responseFromOpenAI?.id}`);
    }
  };

  return (
    <Dialog
      open={openGptModal}
      onOpenChange={(visible) => {
        if (!visible) {
          setOpenGptModal(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setOpenGptModal(true)} asChild>
        <div className="relative h-10 mr-2 rounded-3xl flex justify-center gap-2 items-center">
          <Button
            className={`border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-1 w-full text-sm z-0 group relative items-center font-normal`}
          >
            Try Einstein<span className="text-primary-blue">GPT</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2 h-full w-full">
          <div className="h-8 w-8 rounded-full shadow-md bg-transparent">
            <img
              src="/assets/images/brand.png"
              alt="assistant-image"
              className="w-full object-contain rounded-full h-full"
            />
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <h2 className="text-zinc-100 text-xl font-medium ">
              Unlock unlimited access to Einstein
              <span className="text-primary-blue">GPT</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Get access to the most powerful virtual assistants designed to
              perform your every tasks efficiently.
            </p>
          </div>
          <div className="my-2">
            <ul className="my-3 space-y-2">
              {einsteinGptFeatures?.map((feature, _i) => (
                <li className="flex gap-2 text-sm text-zinc-100" key={_i}>
                  <CheckCheck className="text-primary-blue w-5 h-5 flex-shrink-0" />
                  <span className="flex-shrink">{feature?.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="bg-primary-black text-zinc-100 text-base"
            onClick={() => {
              is_subscribed ? createGPTAssistant() : setOpenPaymentModal(true);
            }}
            disabled={isLoadingSaving || creatingAssistant}
          >
            {isLoadingSaving || creatingAssistant ? "Creating GPT" : " Try now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EinsteinGptModal;

//when done creating then this will happen  setIsGpt(true), navigate("/einsteingpt/555");
