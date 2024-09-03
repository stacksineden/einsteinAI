import { useEffect, useState } from "react";
import ChatInput from "@/components/shared/ChatInput";
import Messages from "@/components/shared/Messages";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { retrieveAssistantOpenAI } from "@/lib/openAI/api";
import { Loader2, Share } from "lucide-react";
import {  useNavigate, useParams } from "react-router-dom";
import ChatIntro from "@/components/shared/ChatIntro";
import {
  getMatchingPromptsForAssistants,
  getMatchingPromptsForTools,
  tools_list,
} from "@/modelDataset";
import { useUserContext } from "@/context/AuthContext";
import { getAssistantLevel } from "@/lib/utils";
import { useMatchingPromptContext } from "@/context/MatchingPromptContext";
import { useAppContext } from "@/context/AppContext";

const AssistantChat = () => {
  const { id } = useParams();
  const { activeThreadId, setAciveThreadId } = useChatContext();
  const { setOpenPaymentModal } = useAppContext();
  const { userSubscriptionDetails } = useUserContext();
  // const [message, setMessage] = useState("");
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});

  const [isLoadingAssistant, setIsLoadingAssistant] = useState(true);

  const { setPromptMessage } = useMatchingPromptContext();

  const navigate = useNavigate();

  // console.log(assistantObject, "assistantObjectassistantObject");
  //get assistants-details from open ai

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
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
      setPromptMessage("");
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
      {!userSubscriptionDetails?.is_subscribed &&
        getAssistantLevel(
          assistantObject?.metadata?.assistant_pretraining_name!
        ) !== "Rookie" && (
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
              <p className="text-base text-zinc-100 opacity-90 w-full md:w-1/2">
                To continue chatting with the assistant, please subscribe. Your
                subscription ensures uninterrupted access to our chat services.
                Thank you for your support!
              </p>
              <Button
                className="bg-primary-black hover:opacity-90 flex gap-2 text-white"
                aria-label="upgrade"
                onClick={() => setOpenPaymentModal(true)}
              >
                Upgrade
              </Button>
            </div>
          </div>
        )}

      {!userSubscriptionDetails?.is_subscribed &&
        getAssistantLevel(
          assistantObject?.metadata?.assistant_pretraining_name!
        ) === "Rookie" && (
          <div className="flex h-screen w-full flex-col justify-between px-4 sm:px-8">
            {/* CHAT HEADER */}
            <div className="py-4 px-3 md:px-1 flex items-center justify-between sticky">
              <div className="w-full flex justify-end px-3 items-center">
                <Share className="h-5 w-5 text-zinc-100 cursor-pointer" />
              </div>
            </div>
            <div className="max-w-5xl self-center w-full flex-1 flex flex-col overflow-hidden">
              {/* CHAT INTRO */}
              {!activeThreadId && (
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <ChatIntro
                    assistant_name={
                      assistantObject?.metadata?.assistant_pretraining_name!
                    }
                    matching_prompts={getMatchingPromptsForAssistants(
                      assistantObject?.metadata?.assistant_pretraining_name!
                    )}
                    user_assistant_name={assistantObject?.name!}
                  />
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
        )}
      {userSubscriptionDetails?.is_subscribed && (
        // <div className="h-screen">
        <div className="flex h-[100dvh] w-full flex-col justify-between px-4 sm:px-8">
          {/* CHAT HEADER */}
          <div className="py-4 px-3 md:px-1 flex items-center justify-between sticky">
            <div className="w-full flex justify-end px-3 items-center">
              <Share className="h-5 w-5 text-zinc-100 cursor-pointer" />
            </div>
          </div>
          <div className="max-w-5xl self-center w-full flex-1 flex flex-col overflow-hidden">
            {/* CHAT INTRO */}
            {!activeThreadId && (
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <ChatIntro
                  assistant_name={
                    assistantObject?.metadata?.assistant_pretraining_name!
                  }
                  matching_prompts={
                    tools_list?.includes(
                      assistantObject?.metadata?.assistant_pretraining_name ??
                        ""
                    )
                      ? getMatchingPromptsForTools(
                          assistantObject?.metadata?.assistant_pretraining_name!
                        )
                      : getMatchingPromptsForAssistants(
                          assistantObject?.metadata?.assistant_pretraining_name!
                        )
                  }
                  user_assistant_name={assistantObject?.name!}
                />
              </div>
            )}
            {/* CHAT MESSAGES */}
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

export default AssistantChat;

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

{
  /* chat sidebar on mobile */
}
{
  /* {showMobileSideBar && (
              <div className="bg-black h-full w-[80%] absolute top-0 left-0 z-10 md:hidden">
                <ChatSideBar
                  showMobileSideBar={setShowMobileSideBar}
                  assistant_name={
                    assistantObject?.metadata?.assistant_pretraining_name!
                  }
                />
              </div>
            )} */
}

{
  /* CHAT HEADER */
}
{
  /* <div className="py-4 px-3 md:px-1 flex items-center justify-between sticky">
              <Menu
                className="h-5 w-5 text-primary-black cursor-pointer block md:hidden"
                onClick={() => setShowMobileSideBar(true)}
              />
              <p className="font-medium text-primary-blue text-xl pl-2">
                EinsteinAI
              </p>
              <div className="w-full flex justify-end px-3 items-center">
                <Share className="h-5 w-5 text-primary-black cursor-pointer" />
              </div>
              <div>
                {showMobileSideBar && (
                  <XCircle
                    className="h-5 w-5 text-primary-red"
                    onClick={() => setShowMobileSideBar(false)}
                  />
                )}
              </div>
              <PenSquare className="h-5 w-5 text-primary-black block md:hidden" />
            </div> */
}
{
  /* CHAT INTRO */
}
{
  /* {!activeThreadId && (
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <ChatIntro
                  assistant_name={
                    assistantObject?.metadata?.assistant_pretraining_name!
                  }
                  matching_prompts={getMatchingPromptsForAssistants(
                    assistantObject?.metadata?.assistant_pretraining_name!
                  )}
                  user_assistant_name={assistantObject?.name!}
                />
              </div>
            )} */
}

{
  /* chat window */
}
{
  /* most likely decoupled to a chat component  */
}
{
  /* CHAT MESSAGES */
}
{
  /* {activeThreadId && (
              <Messages
                threadId={activeThreadId!}
                assistantName={assistantObject?.name!}
                pretrainingName={
                  assistantObject?.metadata?.assistant_pretraining_name!
                }
                matching_prompts={getMatchingPromptsForAssistants(
                  assistantObject?.metadata?.assistant_pretraining_name!
                )}
              />
            )} */
}
{
  /* chat input */
}
{
  /* most likely decoupled to a chat input component  */
}
{
  /* <ChatInput assistantId={id!} threadId={activeThreadId!} /> */
}
