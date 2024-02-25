import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAssistantThreads,
  useSaveThreadToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import {
  ArrowBigLeftDash,
  Loader,
  Loader2,
  PenSquare,
  XCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createAssistantThreadOpenAI } from "@/lib/openAI/api";
import { useToast } from "../ui/use-toast";
import { useChatContext } from "@/context/ChatContext";
import { getImageUrlByName } from "@/modelDataset";
import { Link } from "react-router-dom";

type CreateThreadModalProps = {
  submitFunc: (description: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  assistant_name?: string;
  isCreatingThread: boolean;
};

const CreateThreadModal = ({
  submitFunc,
  isOpen,
  setIsOpen,
  assistant_name,
  isCreatingThread,
}: CreateThreadModalProps) => {
  const [threadDescription, setThreadDescription] = useState("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <div className="flex items-center justify-between px-2 py-1 rounded-lg group h-10 gap-2 cursor-pointer hover:bg-zinc-800 sticky">
          <div className="h-7 w-7 rounded-full shadow-md bg-light-grey flex-shrink-0">
            <img
              src={
                getImageUrlByName(assistant_name!) ||
                "/assets/images/assistants/placeholder.png"
              }
              alt="assistant-image"
              className="w-full object-contain rounded-full h-full"
            />
          </div>
          <p className="text-sm grow overflow-hidden whitespace-nowrap ml-1">
            New Chat
          </p>
          <div className="flex gap-3 items-center justify-center">
            <PenSquare className="h-5 w-5 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="p-2 flex flex-col items-center text-center gap-3">
          <h2 className="font-medium text-lg text-primary-black">
            Give your thread a description
          </h2>
          <Input
            className="h-10 border border-light-grey shadow"
            placeholder="Enter your description"
            onChange={(e) => setThreadDescription(e.target.value)}
          />
          <div className="w-full flex items-center gap-4 justify-center mt-2">
            <Button
              className="bg-primary-black hover:opacity-90 flex gap-2 text-white"
              aria-label="send message"
              onClick={() => submitFunc(threadDescription)}
              disabled={isCreatingThread}
            >
              {isCreatingThread ? (
                <div className="flex-center gap-2">
                  <Loader />
                </div>
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              className="bg-white hover:opacity-90 flex gap-2 text-primary-red border border-primary-red"
              aria-label="send message"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChatSideBar = ({
  showMobileSideBar,
  assistant_name,
}: ChatSideBarProps) => {
  const { id } = useParams();
  const { toast } = useToast();

  const { activeThreadId, setAciveThreadId } = useChatContext();
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const {
    data: threads,
    isPending: isThreadsLoading,
    isError: isErrorThreads,
  } = useGetAssistantThreads(id!);

  const { mutateAsync: saveThread, isPending: isLoadingSaving } =
    useSaveThreadToDB();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleThreadCreation = async (description: string) => {
    setIsCreatingThread(true);
    const res = await createAssistantThreadOpenAI(description);
    if (res) {
      toast({
        description: "Your Thread is successfully created.", 
        className: "bg-primary-blue text-white",
      });
      //save to database
      const threadObject = {
        description: res?.metadata?.description,
        thread_id: res?.id,
        assistant_id: id!,
      };

      const newThread = await saveThread(threadObject); 
      if (newThread) {
        toast({
          description: "Your Thread is successfully saved.",
          className: "bg-primary-blue text-white",
        });
        setIsCreatingThread(false);
        setIsOpen(false);
        setAciveThreadId(threadObject?.thread_id!);
      }
      if (!newThread) {
        setIsCreatingThread(false);
        return toast({
          title: "Unable to create thread!",
          description: "Please try again",
          className: "bg-red-200 text-white",
        });
      }
    }
    if (!res) {
      setIsCreatingThread(false);
      return toast({
        title: "Something went wrong!",
        description: "Please try again",
        className: "bg-red-200 text-white",
      });
    }
  };

  return (
    <div className="bg-primary-black text-white p-3 h-screen flex flex-col relative">
      <div className="flex-1">
        <div>
          {/* NEW CHAT */}
          <CreateThreadModal
            submitFunc={handleThreadCreation}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            assistant_name={assistant_name}
            isCreatingThread={isCreatingThread}
          />

          {/* THREADS */}

          <div className="mt-10 px-2 flex flex-col gap-5 overflow-y-scroll h-[75vh]">
            <p className="text-sm text-white opacity-70">Threads</p>
            <div className="flex flex-col gap-1">
              {threads?.documents && threads?.documents?.length !== 0 ? (
                threads.documents.map((thread) => (
                  <div
                    key={thread.thread_id}
                    className={`flex items-center px-2 py-3 rounded-lg truncate cursor-pointer hover:bg-zinc-800 text-white text-sm ${
                      activeThreadId === thread?.thread_id && "bg-zinc-800"
                    }`}
                    onClick={() => {
                      setAciveThreadId(thread?.thread_id);
                      showMobileSideBar && showMobileSideBar(false);
                    }}
                  >
                    {thread.description}
                  </div>
                ))
              ) : (
                <div>No threads</div>
              )}
              {isThreadsLoading && (
                <div className="flex flex-col items-center justify-center h-full w-full gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <div className="text-white text-base">
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
        </div>
        <div className="flex flex-col">
          <Link
            className="flex items-center px-2 py-4 rounded-lg group h-10 gap-2 cursor-pointer bg-zinc-800"
            to={"/my-assistants"}
          >
            <ArrowBigLeftDash className="h-7 w-7 text-primary-yellow" />
            <p>back to assistants</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center px-2 py-1 rounded-lg group h-10 gap-2 cursor-pointer">
          <p className="font-medium text-primary-blue text-lg pl-1">
            EinsteinAI
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;

type ChatSideBarProps = {
  showMobileSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
  assistant_name?: string;
};
