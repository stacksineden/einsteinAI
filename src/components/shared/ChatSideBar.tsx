import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAssistantThreads,
  useSaveThreadToDB,
  useSignOutAccount,
} from "@/lib/tanstack-query/queriesAndMutation";
import {
  AlignLeft,
  ChevronsLeft,
  Compass,
  FolderClosed,
  Ghost,
  Loader2,
  LogOut,
  PenSquare,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createAssistantThreadOpenAI } from "@/lib/openAI/api";
import toast from "react-hot-toast";
import { useChatContext } from "@/context/ChatContext";
import { getImageUrlByName } from "@/modelDataset";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import BillingModal from "./BillingModal";

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
        <div className="flex items-center justify-between px-2 py-3 rounded-lg group h-10 gap-2 cursor-pointer hover:bg-zinc-800 sticky border-[0.5px] border-zinc-800">
          <div className="h-7 w-7 rounded-full shadow-md bg-transparent flex-shrink-0">
            <img
              src={
                assistant_name === "EinsteinGPT"
                  ? "/assets/images/brand.png"
                  : getImageUrlByName(assistant_name!) ||
                    "/assets/images/assistants/placeholder.png"
              }
              alt="assistant-image"
              className="w-full object-contain rounded-full h-full"
            />
          </div>
          <p className="text-sm grow overflow-hidden whitespace-nowrap ml-1 text-zinc-100">
            New Chat
          </p>
          <div className="flex gap-3 items-center justify-center">
            <PenSquare className="h-5 w-5 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="p-2 flex flex-col items-center text-center gap-3">
          <h2 className="font-medium text-lg text-zinc-100">
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
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
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
  const navigate = useNavigate();

  const { activeThreadId, setAciveThreadId } = useChatContext();
  const {
    setMobileOpen,
    chatOpen,
    setChatOpen,
    chatMobileOpen,
    setChatMobileOpen,
  } = useAppContext();
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const { user, userSubscriptionDetails } = useUserContext();

  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutAccount();

  const {
    data: threads,
    isPending: isThreadsLoading,
    isError: isErrorThreads,
  } = useGetAssistantThreads(id!);

  const { mutateAsync: saveThread } = useSaveThreadToDB();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleThreadCreation = async (description: string) => {
    setIsCreatingThread(true);
    const res = await createAssistantThreadOpenAI(description);
    if (res) {
      toast.success("Your Thread is successfully created.");
      //save to database
      const threadObject = {
        description: res?.metadata?.description,
        thread_id: res?.id,
        assistant_id: id!,
      };

      const newThread = await saveThread(threadObject);
      if (newThread) {
        toast.success("Your Thread is successfully saved.");
        setIsCreatingThread(false);
        setIsOpen(false);
        showMobileSideBar && showMobileSideBar(false);
        setChatMobileOpen && setChatMobileOpen(false);
        setAciveThreadId(threadObject?.thread_id!);
      }
      if (!newThread) {
        setIsCreatingThread(false);
        return toast.error("Unable to create thread!");
      }
    }
    if (!res) {
      setIsCreatingThread(false);
      return toast.error("Something went wrong!");
    }
  };

  const handleSignOut = async () => {
    const response = await signOut();
    if (response) {
      toast.success('"Logout successful!"');
      navigate("/sign-in");
    }
    if (!response) {
      return toast.error("Unable to logout!");
    }
  };

  return (
    <aside className="h-[100dvh] overflow-hidden">
      {/* Desktop */}
      <div className="w-full h-full hidden md:flex mr-7">
        <div
          className={`lg:block ${
            chatOpen
              ? "translate-x-0 max-w-64 transition-all duration-300 ease-out"
              : "-translate-x-full max-w-0 transition-all duration-300 ease-out"
          }  overflow-hidden block`}
        >
          <div className="h-full border-r border-r-zinc-700 w-64">
            <div className="flex h-full flex-col overflow-hidden bg-black border-r-zinc-700 w-full">
              <div className="pl-6 pt-6 grid grid-cols-2 w-full items-center">
                {/* <Logo /> */}
                <img
                  src={`${
                    assistant_name === "EinsteinGPT"
                      ? "/assets/images/text-brand-gpt.png"
                      : "/assets/images/text-brand.png"
                  }`}
                  alt="brand"
                  className="w-full object-contain cursor-pointer"
                  loading="lazy"
                  onClick={() => {
                    if (assistant_name === "EinsteinGPT") {
                      navigate(`einsteingpt/${id}`);
                    } else {
                      navigate("/app");
                    }
                  }}
                />
                <div
                  className="z-0 group inline-flex items-center justify-center justify-self-end mr-2 cursor-pointer"
                  onClick={() => setChatOpen(false)}
                >
                  <ChevronsLeft className="text-zinc-400" />
                </div>
              </div>

              <div className="flex-grow flex-col overflow-hidden mt-4">
                <div className="w-full px-4">
                  <CreateThreadModal
                    submitFunc={handleThreadCreation}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    assistant_name={assistant_name}
                    isCreatingThread={isCreatingThread}
                  />
                  {assistant_name !== "einsteingpt" && (
                    <Button
                      className="bg-zinc-800 hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm"
                      aria-label="upgrade"
                      onClick={() => navigate("/my-assistants")}
                    >
                      <Compass className="text-zinc-100" />
                      My Assistants
                    </Button>
                  )}
                </div>

                <div className="flex flex-col overflow-hidden pt-2 md:pt-5 relative">
                  <div className="text-zinc-400 hidden lg:block ml-5 ">
                    <p className="font-normal">My Threads</p>
                  </div>
                  <div
                    className="w-full relative flex flex-col gap-1 p-4 pt-3 overflow-y-auto h-[50vh]"
                    data-slot="base"
                    aria-label="Recent assistants"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    <div
                      data-slot="list"
                      className="w-full flex flex-col gap-0.5 outline-none"
                    >
                      {isErrorThreads && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Ghost className="text-zinc-100 " />
                          <p className="text-center text-zinc-100 text-base font-medium ">
                            Error Loading Assistants
                          </p>
                        </div>
                      )}
                      {threads?.documents?.length === 0 && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Ghost className="text-zinc-100 " />
                          <p className="text-center text-zinc-100 text-base font-medium ">
                            Pretty empty around here
                          </p>
                          <p className="text-center text-zinc-300 text-xs">
                            Let&apos;s{" "}
                            <Link to={"#"} className="text-primary-blue">
                              create
                            </Link>{" "}
                            your first Thread.
                          </p>
                        </div>
                      )}
                      {isThreadsLoading && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          <p className="text-zinc-100 text-sm">
                            Loading Your Threads ....
                          </p>
                        </div>
                      )}
                      {threads?.documents?.map((thread) => (
                        <ul className="pt-1" key={thread.thread_id}>
                          <li
                            className={`flex group gap-3 items-center justify-between relative p-3 h-full box-border rounded-lg transition-all ease-out duration-300 cursor-pointer outline-none hover:bg-zinc-800 ${
                              activeThreadId === thread?.thread_id &&
                              "bg-zinc-800"
                            }`}
                            onClick={() => {
                              setAciveThreadId(thread?.thread_id);
                            }}
                          >
                            <p className="group-hover:truncate text-white tracking-wide text-sm truncate">
                              {thread.description}
                            </p>
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end pb-2 px-5">
                <div
                  data-aria-orientation="horizontal"
                  role="none"
                  className="shrink-0 bg-zinc-700 w-full h-[1px]"
                ></div>
                <div className="flex flex-col gap-3 py-3">
                  {assistant_name !== "einsteingpt" && (
                    <Button
                      className="bg-zinc-700 border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm z-0 group relative items-center font-normal"
                      aria-label="upgrade"
                      onClick={() => navigate("/files")}
                    >
                      <FolderClosed className="text-zinc-100" />
                      My Files
                    </Button>
                  )}

                  <BillingModal
                    user={user}
                    userSubscriptionDetails={userSubscriptionDetails}
                  />
                  {assistant_name === "einsteingpt" && (
                    <div
                      className="flex items-center gap-1 cursor-pointer justify-center"
                      onClick={handleSignOut}
                    >
                      {isSigningOut ? (
                        <Loader2 className="h-4 w-4 md:h-6 md:w-6 text-blue-500 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 md:h-6 md:w-6 text-zinc-100" />
                      )}
                      <p className="text-zinc-100 text-xs md:text-sm font-medium">
                        {isSigningOut ? "Loging out" : "Log out"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`m-5 items-center absolute z-50 cursor-pointer ${
            chatOpen ? "hidden" : "block"
          } opacity-100 text-black`}
          onClick={() => setChatOpen(true)}
        >
          <AlignLeft className="text-zinc-400 h-7 w-7" />
        </div>
      </div>

      {/* Mobile */}

      <div className="w-full h-full flex md:hidden mr-0 overflow-hidden">
        <div className="absolute left-0 top-0 z-50 flex h-full">
          <div className="absolute z-0 left-0 top-0 h-full w-full flex-auto bg-transparent"></div>
          <div
            className={`absolute z-50 top-0 h-full w-64 border-r border-r-zinc-700 bg-zinc-900 ${
              chatMobileOpen ? "left-0 " : "transform -translate-x-full"
            }`}
          >
            <div className="h-full overflow-hidden">
              <div className="h-full border-r border-r-500 w-64 overflow-hidden">
                <div className="flex h-full flex-col overflow-hidden bg-black border-r-zinc-700 w-full">
                  <div className="pl-6 pt-6 grid grid-cols-2 w-full items-center">
                    <img
                      src={`${
                        assistant_name === "EinsteinGPT"
                          ? "/assets/images/text-brand-gpt.png"
                          : "/assets/images/text-brand.png"
                      }`}
                      alt="brand"
                      className="w-full object-contain cursor-pointer"
                      loading="lazy"
                      onClick={() => {
                        if (assistant_name === "EinsteinGPT") {
                          navigate(`einsteingpt/${id}`);
                          setChatMobileOpen(false);
                          setMobileOpen(false);
                        } else {
                          navigate("/app");
                          setChatMobileOpen(false);
                          setMobileOpen(false);
                        }
                      }}
                    />

                    <div
                      className="z-0 group inline-flex items-center justify-center justify-self-end mr-2 cursor-pointer"
                      onClick={() => setChatMobileOpen(false)}
                    >
                      <ChevronsLeft className="text-zinc-400" />
                    </div>
                  </div>

                  <div className="flex flex-col overflow-hidden mt-4">
                    <div className="w-full px-4">
                      <CreateThreadModal
                        submitFunc={handleThreadCreation}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        assistant_name={assistant_name}
                        isCreatingThread={isCreatingThread}
                      />
                      <Button
                        className="bg-zinc-800 hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm"
                        aria-label="upgrade"
                        onClick={() => navigate("/my-assistants")}
                      >
                        <Compass className="text-zinc-100" />
                        My Assistants
                      </Button>
                    </div>

                    <div className="flex flex-col overflow-hidden pt-2 md:pt-5 relative">
                      <div className="text-zinc-400 block ml-5 ">
                        <p className="font-normal">My Threads</p>
                      </div>
                      <div
                        className="w-full relative flex flex-col gap-1 p-4 pt-3 overflow-y-auto scrollbar-hide"
                        data-slot="base"
                        aria-label="Recent threads"
                        style={{ maxHeight: "calc(100vh - 400px)" }}
                      >
                        <div
                          data-slot="list"
                          className="w-full flex flex-col gap-0.5 outline-none"
                        >
                          {isErrorThreads && (
                            <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                              <Ghost className="text-zinc-100 " />
                              <p className="text-center text-zinc-100 text-base font-medium ">
                                Error Loading Assistants
                              </p>
                            </div>
                          )}
                          {threads?.documents?.length === 0 && (
                            <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                              <Ghost className="text-zinc-100 " />
                              <p className="text-center text-zinc-100 text-base font-medium ">
                                Pretty empty around here
                              </p>
                              <p className="text-center text-zinc-300 text-xs">
                                Let&apos;s{" "}
                                <Link to={"#"} className="text-primary-blue">
                                  create
                                </Link>{" "}
                                your first Assistant.
                              </p>
                            </div>
                          )}
                          {isThreadsLoading && (
                            <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                              <p className="text-zinc-100 text-sm">
                                Loading Your Threads ....
                              </p>
                            </div>
                          )}
                          {threads?.documents?.map((thread) => (
                            <ul className="pt-1" key={thread.thread_id}>
                              <li
                                className={`flex group gap-3 items-center justify-between relative p-3 h-full box-border rounded-lg transition-all ease-out duration-300 cursor-pointer outline-none hover:bg-zinc-800 ${
                                  activeThreadId === thread?.thread_id &&
                                  "bg-zinc-800"
                                }`}
                                onClick={() => {
                                  setAciveThreadId(thread?.thread_id);
                                  setChatMobileOpen(false);
                                }}
                              >
                                <p className="group-hover:truncate text-white tracking-wide text-xs truncate">
                                  {thread.description}
                                </p>
                              </li>
                            </ul>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end pb-2 px-5 mb-8 md:mb-0">
                    <div
                      data-aria-orientation="horizontal"
                      role="none"
                      className="shrink-0 bg-zinc-700 w-full h-[1px]"
                    ></div>
                    <div className="flex flex-col gap-3 py-3">
                      <Button
                        className="bg-zinc-700 border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm z-0 group relative items-center font-normal"
                        aria-label="upgrade"
                        onClick={() => {
                          setChatMobileOpen(false);
                          navigate("/files");
                        }}
                      >
                        <FolderClosed className="text-zinc-100" />
                        My Files
                      </Button>
                      {/* <Button
                        className="bg-zinc-700 border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-1 w-full text-sm z-0 group relative items-center font-normal"
                        aria-label="upgrade"
                        onClick={() => {}}
                      >
                        <User className="text-zinc-100" />
                        Your Account
                      </Button> */}
                      <BillingModal
                        user={user}
                        userSubscriptionDetails={userSubscriptionDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`m-5 items-center absolute z-50 cursor-pointer opacity-100 text-black ${
            chatMobileOpen ? "hidden" : " block"
          }`}
          onClick={() => setChatMobileOpen(true)}
        >
          <AlignLeft className="text-zinc-400 h-7 w-7" />
        </div>
      </div>
    </aside>
  );
};

export default ChatSideBar;

type ChatSideBarProps = {
  showMobileSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
  assistant_name?: string;
};
