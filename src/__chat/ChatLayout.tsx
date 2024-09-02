import ChatSideBar from "@/components/shared/ChatSideBar";
import { retrieveAssistantOpenAI } from "@/lib/openAI/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const ChatLayout = () => {
  const { id } = useParams();
  const isAuthenticated = false;
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});
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
        <p className="text-base text-zinc-100">Loading up...</p>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/sign-in" />
      ) : (
        <div className="h-full">
          <div className="bg-zinc-900 h-full">
            <main>
              <div>
                <div className="bg-zinc-900 relative overflow-hidden">
                  <div className="flex h-full">
                    <ChatSideBar
                      assistant_name={ 
                        assistantObject?.metadata?.assistant_pretraining_name ?? "einsteingpt"
                      }
                    />
                    <main className="h-[100dvh] flex-1 overflow-x-hidden">
                      <Outlet />
                    </main>
                  </div>
                </div>
              </div>
            </main>
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
