import ChatSideBar from "@/components/shared/ChatSideBar";
import { useUserContext } from "@/context/AuthContext";
import { retrieveAssistantOpenAI } from "@/lib/openAI/api";
import { getAssistantLevel } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const ChatLayout = () => {
  const { id } = useParams();
  const isAuthenticated = false;
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});
  const { userSubscriptionDetails } = useUserContext();
  const [isLoadingAssistant, setIsLoadingAssistant] = useState(true);
  //get assistants-details from open ai

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
    setAssistantObject(data);
    setIsLoadingAssistant(false);
  };

  useEffect(() => {
    getAssistantInfo(id!);
  }, [id]);

  if (isLoadingAssistant) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-2">
        <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
        <p className="text-base text-primary-black">Loading up...</p>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/sign-in" />
      ) : (
        <div className="flex">
          {!userSubscriptionDetails?.is_subscribed &&
            getAssistantLevel(
              assistantObject?.metadata?.assistant_pretraining_name!
            ) === "Rookie" && (
              <div className="bg-primary-black max-w-xs h-screen md:min-w-[20rem] hidden md:block">
                <ChatSideBar
                  assistant_name={
                    assistantObject?.metadata?.assistant_pretraining_name
                  }
                />
              </div>
            )}
          {userSubscriptionDetails?.is_subscribed && (
            <div className="bg-primary-black max-w-xs h-screen md:min-w-[20rem] hidden md:block">
              <ChatSideBar
                assistant_name={
                  assistantObject?.metadata?.assistant_pretraining_name
                }
              />
            </div>
          )}
          <div className="flex-1 bg-white w-full">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatLayout;

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
