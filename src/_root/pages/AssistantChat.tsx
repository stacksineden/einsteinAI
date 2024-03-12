import { useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import { truncateText } from "@/lib/utils";
import { retrieveAssistantOpenAI } from "@/lib/openAI/api";
import { useParams } from "react-router-dom";
import { getImageUrlByName } from "@/modelDataset";
import Messages from "@/components/shared/Messages";
import ChatInput from "@/components/shared/ChatInput";
import { Loader2, Trash2, XCircle } from "lucide-react";
import { useGetAssistantThreads } from "@/lib/tanstack-query/queriesAndMutation";

const AssistantChat = () => {
  const { id } = useParams();

  const {
    data: threads,
    isPending: isThreadsLoading,
    isError: isErrorThreads,
  } = useGetAssistantThreads(id!);

  const [isExpanded, setIsExpanded] = useState(false);
  const [assistantObject, setAssistantObject] = useState<IAssistant>({});
  const [showTools, setShowTools] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>("");

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  //get assistants-details from open ai

  const getAssistantInfo = async (id: string) => {
    const data = await retrieveAssistantOpenAI(id);
    setAssistantObject(data);
  };

  useEffect(() => {
    getAssistantInfo(id!);
  }, [id]);

  const isLoading = false;

  //always in validate quries for when this loaded
  

  //loading state messages
  //append messages to thread
  //list messages
  //runs and polling

  {
    isLoading && (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing...</h3>
            <p className="text-zinc-500 text-sm">This won&apos;t take long.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="mx-auto w-full shadow-md rounded-md border border-light-grey p-4 flex h-[80vh]">
        <div className="flex-[30%] flex flex-col gap-4 p-4 border-r border-r-light-grey h-full overflow-y-scroll">
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="h-20 w-20 rounded-full shadow-md bg-light-grey">
              <img
                src={
                  getImageUrlByName(
                    assistantObject?.metadata?.assistant_pretraining_name!
                  ) || "/assets/images/assistants/henry.png"
                }
                alt="assistant-image"
                className="w-full object-contain rounded-full h-full"
              />
            </div>
            <div
              className="text-white text-sm font-medium cursor-pointer p-2 bg-primary-black rounded-lg"
              onClick={() => setShowTools(!showTools)}
            >
              {showTools ? "View Threads" : "View Tools"}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-medium text-xl text-primary-black flex items-center">
              {assistantObject?.name}
            </div>
            <div className="text-base text-primary-blue font-medium">
              {assistantObject?.metadata?.role}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-primary-black text-lg font-medium">
              Description
            </h3>
            <div className="text-sm font-light tracking-wide text-primary-black">
              {isExpanded
                ? assistantObject?.description
                : truncateText(assistantObject?.description || "", 200)}
              {assistantObject?.description?.length! > 200 && (
                <div
                  className="text-primary-black cursor-pointer underline font-medium"
                  onClick={toggleExpansion}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </div>
              )}
            </div>
          </div>
          {showTools ? (
            <div className="flex flex-col gap-1">
              <h3 className="text-primary-black text-lg font-medium">
                Assistant Tools
              </h3>
              <div className="flex flex-col gap-1 px-1">
                {assistantObject?.tools &&
                  assistantObject?.tools?.map((tool, _i) => (
                    <div className="flex flex-col gap-1" key={_i}>
                      <div className="w-full border border-light-grey p-2 rounded-lg text-base font-light">
                        {tool?.type}
                      </div>
                      {tool?.function && (
                        <div className="flex flex-col gap-1 ml-2">
                          <div className=" text-sm text-primary-black font-medium">
                            {tool?.function?.name}
                          </div>
                          <div className="text-sm text-primary-blue font-medium">
                            {tool?.function?.description}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h3 className="text-primary-black text-lg font-medium">
                Threads
              </h3>
              {/* load threads */}
              <div className="flex flex-col gap-1 px-1">
                {threads?.documents && threads?.documents?.length !== 0 ? (
                  threads.documents.map((thread) => (
                    <div
                      key={thread.thread_id}
                      className="w-full border border-light-grey p-2 rounded-lg text-base font-light cursor-pointer flex items-center justify-between"
                      onClick={() => setActiveThreadId(thread?.thread_id)}
                    >
                      {/* Render content for each thread */}
                      <p>{thread.description}</p>
                      <Trash2 className="text-primary-red h-4 w-4" />
                      {/* Add more content as needed */}
                    </div>
                  ))
                ) : (
                  <div>No threads</div>
                )}
                {isThreadsLoading && (
                  <div className="flex flex-col items-center justify-center h-full w-full gap-2">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <div className="text-black text-base">
                      Loading your threads...
                    </div>
                  </div>
                )}
                {isErrorThreads && (
                  <div className="flex flex-col items-center justify-center h-full w-full gap-2">
                    <XCircle className="h-10 w-10 text-primary-red" />
                    <div className="text-black text-base">
                      Error Getting threads
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex-[70%]">
          <div className="relative min-h-full border border-light-grey flex divide-y divide-light-grey flex-col justify-between gap-2 rounded-lg">
            <div className="flex-1 justify-between flex flex-col">
              <Messages
                threadId={
                  activeThreadId
                    ? activeThreadId
                    : threads?.documents[0]?.thread_id
                }
                assistantName={assistantObject?.name!}
                pretrainingName={assistantObject?.metadata?.assistant_pretraining_name!}
              />
            </div> 
            <ChatInput
              assistantId={id!}  
              threadId={
                activeThreadId
                  ? activeThreadId
                  : threads?.documents[0]?.thread_id
              }
            />
          </div>
        </div>
      </div>
    </Container>
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
