import { useEffect, useState } from "react";
import ChatInput from "@/components/shared/ChatInput";
import { useUserContext } from "@/context/AuthContext";
import { useChatContext } from "@/context/ChatContext";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import EinsteinGptIntro from "@/components/shared/EinsteinGptIntro";
import { useGetUserAssistants } from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { retrieveAssistantOpenAI } from "@/lib/openAI/api";
import Messages from "@/components/shared/Messages";
import { useAppContext } from "@/context/AppContext";

const EinsteinGptChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userSubscriptionDetails } = useUserContext();
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});
  const [isLoadingAssistant, setIsLoadingAssistant] = useState(true);
  const { activeThreadId, setAciveThreadId } = useChatContext();
  const { setOpenPaymentModal } = useAppContext();

  const { data: assistants } = useGetUserAssistants(user?.id);

  const gptAssistant = assistants?.documents?.filter(
    (assistant: Models.Document) => assistant?.role === "einsteinGPT"
  );

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
    // console.log(data, "data");
    // redirect to app if assiatant is not found
    if (!data) {
      navigate("/my-assistants");
    }
    setAssistantObject(data);
    setIsLoadingAssistant(false);
  };

  useEffect(() => {
    getAssistantInfo(id!);

    return () => {
      // Reset the activeThreadId to an empty string
      setAciveThreadId("");
    };
  }, [id]);

  if (isLoadingAssistant) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-2">
        <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
        <p className="text-base text-zinc-100">Loading up...</p>
      </div>
    );
  }

  return (
    <>
      {!userSubscriptionDetails?.is_subscribed && (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="flex flex-col gap-3 items-center justify-center text-center px-4">
            <div className="h-20 w-20 rounded-full shadow-md bg-light-grey">
              <img
                src={"/assets/images/assistants/placeholder.png"}
                alt="assistant-image"
                className="w-full object-contain rounded-full h-full"
              />
            </div>
            <h3 className="font-semibold text-zinc-100 text-2xl">
              Assistant Temporarily Unavailable
            </h3>
            <p className="text-base text-zinc-400 w-full md:w-1/2">
              To continue chatting with the assistant, please subscribe. Your
              subscription ensures uninterrupted access to our chat services.
              Thank you for your support!
            </p>
            <Button
              className="bg-primary-black hover:opacity-90 flex gap-2 text-zinc-100"
              aria-label="upgrade"
              onClick={() => setOpenPaymentModal(true)}
            >
              Upgrade
            </Button>
          </div>
        </div>
      )}

      {userSubscriptionDetails?.is_subscribed && (
        // <div className="h-screen">
        <div className="flex h-[100dvh] w-full flex-col justify-between px-4 sm:px-8">
          {/* CHAT HEADER */}
          <div className="py-4 px-3 md:px-1 flex items-center justify-between sticky">
            <div className="w-full flex justify-end px-3 items-center gap-2">
              <Switch
                className="bg-primary-blue"
                onCheckedChange={() => {
                  navigate("/app");
                }}
                checked={!!gptAssistant}
              />
              <p className="text-zinc-100 text-xs md:text-sm">
                Switch to Einstein
                <span className="font-semibold text-primary-blue text-base">
                  AI
                </span>
              </p>
            </div>
          </div>
          <div className="max-w-5xl self-center w-full flex-1 flex flex-col overflow-hidden">
            {/* CHAT INTRO */}
            {!activeThreadId && (
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"> 
                <EinsteinGptIntro />
              </div>
            )}
            {activeThreadId && (
              <Messages 
                threadId={activeThreadId!}
                assistantName={assistantObject?.name!}
                pretrainingName={
                  assistantObject?.metadata?.assistant_pretraining_name!
                }
                // matching_prompts={getMatchingPromptsForAssistants(
                //   assistantObject?.metadata?.assistant_pretraining_name!
                // )}
              />
            )}
          </div>
          <ChatInput assistantId={id!} threadId={activeThreadId!} />
        </div>
        // </div>
      )}
    </>
  );
};

export default EinsteinGptChat;

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
  metadata?: {
    assistant_pretraining_name?: string;
    role?: string;
  };
  description?: string;
  tools?: Tools[];
};
