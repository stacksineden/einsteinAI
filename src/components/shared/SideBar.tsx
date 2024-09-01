import {
  AlignLeft,
  ChevronsLeft,
  Compass,
  FolderClosed,
  Ghost,
  Loader2,
  // Menu,
  MessageCircle,
  Plus
} from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserAssistants } from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";
import { getImageUrlByName } from "@/modelDataset";
import BillingModal from "./BillingModal";
// import Logo from "./Logo";

const SideBar = () => {
  const { open, setOpen, mobileOpen, setMobileOpen } = useAppContext();

  const navigate = useNavigate();

  const { user, userSubscriptionDetails } = useUserContext();

  const {
    data: assistants,
    isPending: isAssistantsLoading,
    isError: isErrorAssistants,
  } = useGetUserAssistants(user?.id); 


  return (
    <aside className="h-full overflow-hidden">
      {/* Desktop */}
      <div className="w-full h-full hidden md:flex mr-7">
        <div
          className={`lg:block ${
            open
              ? "translate-x-0 max-w-64 transition-all duration-300 ease-out"
              : "-translate-x-full max-w-0 transition-all duration-300 ease-out"
          }  overflow-hidden block`}
        >
          <div className="h-full border-r border-r-zinc-700 w-64">
            <div className="flex h-full flex-col overflow-hidden bg-black border-r-zinc-700 w-full">
              <div className="pl-6 pt-6 grid grid-cols-2 w-full items-center">
                {/* <Logo /> */}
                <img
                  src="/assets/images/text-brand.png"
                  alt="brand"
                  className="w-full object-contain cursor-pointer"
                  loading="lazy"
                  onClick={() => navigate("/app")}
                />
                <div
                  className="z-0 group inline-flex items-center justify-center justify-self-end mr-2 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <ChevronsLeft className="text-zinc-400" />
                </div>
              </div>

              <div className="flex-grow flex-col overflow-hidden mt-4">
                <div className="w-full px-4">
                  <Button
                    className="bg-zinc-700 hover:opacity-90 flex gap-2 text-zinc-100 rounded-full text-sm"
                    aria-label="upgrade"
                    onClick={() => navigate("/create-assistant")}
                  >
                    <Plus className="text-zinc-100" />
                    Create
                  </Button>
                  <Button
                    className="bg-zinc-800 hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm"
                    aria-label="upgrade"
                    onClick={() => navigate("/app")}
                  >
                    <Compass className="text-zinc-100" />
                    Discover
                  </Button>
                </div>

                <div className="flex flex-col overflow-hidden pt-2 md:pt-5 relative">
                  <div className="text-zinc-400 hidden lg:block ml-5 ">
                    <p className="font-normal">My Assistants</p>
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
                      {isErrorAssistants && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Ghost className="text-zinc-100 " />
                          <p className="text-center text-zinc-100 text-base font-medium ">
                            Error Loading Assistants
                          </p>
                        </div>
                      )}
                      {assistants?.documents?.length === 0 && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Ghost className="text-zinc-100 " />
                          <p className="text-center text-zinc-100 text-base font-medium ">
                            Pretty empty around here
                          </p>
                          <p className="text-center text-zinc-300 text-xs">
                            Let&apos;s{" "}
                            <Link
                              to={"/create-assistant"}
                              className="text-primary-blue"
                            >
                              create
                            </Link>{" "}
                            your first Assistant.
                          </p>
                        </div>
                      )}
                      {isAssistantsLoading && (
                        <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                          <p className="text-zinc-100 text-sm">
                            Loading Your Assistants ....
                          </p>
                        </div>
                      )}
                      {assistants?.documents
                        ?.filter(
                          (assistant) => assistant?.role !== "einsteinGPT"
                        )
                        ?.map((assistant: Models.Document) => (
                          <ul
                            className="pt-1"
                            key={assistant.$id}
                            onClick={() =>
                              navigate(
                                `/chat-assistant/${assistant?.assistant_id}`
                              )
                            }
                          >
                            <li className="flex group gap-3 items-center justify-between relative px-2 py-1.5 h-full box-border rounded-lg transition-all ease-out duration-300 cursor-pointer outline-none hover:bg-zinc-800">
                              <span className="relative flex w-[32px] h-[32px] overflow-hidden rounded-full shrink-0 grow-0">
                                <img
                                  src={
                                    getImageUrlByName(
                                      assistant?.assistant_pretraining_name
                                    ) ||
                                    "/assets/images/assistants/placeholder.png"
                                  }
                                  alt="icon"
                                  className="h-[32px] w-[32px] object-cover object-center shrink-0 grow-0 rounded-full"
                                />
                              </span>
                              <span className="flex-1 text-sm truncate font-normal text-white">
                                <div className="w-full flex flex-row justify-between gap-1 items-center">
                                  <p className="group-hover:truncate text-white tracking-wide">
                                    {assistant?.name}
                                  </p>
                                  <div className="z-0 group relative inline-flex items-center justify-center box-border overflow-hidden">
                                    {/* chat icon */}
                                    <MessageCircle className="text-zinc-500 h-5 w-5" />
                                  </div>
                                </div>
                              </span>
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
                  <Button
                    className="bg-transparent border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm z-0 group relative items-center font-normal"
                    aria-label="upgrade"
                    onClick={() => navigate("/files")}
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
        <div
          className={`m-5 items-center absolute z-50 cursor-pointer ${
            open ? "hidden" : "block"
          } opacity-100 text-black`}
          onClick={() => setOpen(true)}
        >
          <AlignLeft className="text-zinc-400 h-7 w-7" />
        </div>
      </div>
      {/* Desktop */}

      {/* Mobile */}
      <div className="w-full h-full flex md:hidden mr-0">
        <div className="absolute left-0 top-0 z-50 flex h-full">
          <div className="absolute z-0 left-0 top-0 h-full w-full flex-auto bg-transparent"></div>
          <div
            className={`absolute z-50 top-0 h-full w-64 border-r border-r-zinc-700 bg-zinc-900 ${
              mobileOpen ? "left-0 " : "transform -translate-x-full"
            }`}
          >
            <div className="h-full">
              <div className="h-full border-r border-r-500 w-64">
                <div className="flex h-full flex-col overflow-hidden bg-black border-r-zinc-700 w-full">
                  <div className="pl-6 pt-6 grid grid-cols-2 w-full items-center">
                    <img
                      src="/assets/images/text-brand.png"
                      alt="brand"
                      className="w-full object-contain cursor-pointer"
                      loading="lazy"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/app");
                      }}
                    />
                    <div
                      className="z-0 group inline-flex items-center justify-center justify-self-end mr-2 cursor-pointer"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ChevronsLeft className="text-zinc-400" />
                    </div>
                  </div>

                  <div className="flex-col overflow-hidden mt-4">
                    <div className="w-full px-4">
                      <Button
                        className="bg-zinc-700 hover:opacity-90 flex gap-2 text-zinc-100 rounded-full text-sm"
                        aria-label="upgrade"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate("/create-assistant"); 
                        }}
                      >
                        <Plus className="text-zinc-100" />
                        Create
                      </Button>
                      <Button
                        className="bg-zinc-800 hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm"
                        aria-label="upgrade"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate("/app");
                        }}
                      >
                        <Compass className="text-zinc-100" />
                        Discover
                      </Button>
                    </div>

                    <div className="flex-grow flex flex-col overflow-hidden pt-2 md:pt-5 relative">
                      <div className="text-zinc-400 block ml-5 ">
                        <p className="font-normal">My Assistants</p>
                      </div>
                      <div
                        className="w-full relative flex flex-col gap-1 p-4 pt-3 overflow-y-auto"
                        data-slot="base"
                        aria-label="Recent assistants"
                        style={{ maxHeight: "calc(100vh - 350px)" }}
                      >
                        <div
                          data-slot="list"
                          className="w-full flex flex-col gap-0.5 outline-none"
                        >
                          {isErrorAssistants && (
                            <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                              <Ghost className="text-zinc-100 " />
                              <p className="text-center text-zinc-100 text-base font-medium ">
                                Error Loading Assistants
                              </p>
                            </div>
                          )}
                          {assistants?.documents?.length === 0 && (
                            <div className="w-full flex flex-col justify-center items-center my-7  gap-2">
                              <Ghost className="text-zinc-100 " />
                              <p className="text-center text-zinc-100 text-base font-medium ">
                                Pretty empty around here
                              </p>
                              <p className="text-center text-zinc-300 text-xs">
                                Let&apos;s{" "}
                                <Link
                                  to={"/create-assistant"}
                                  className="text-primary-blue"
                                >
                                  create
                                </Link>{" "}
                                your first Assistant.
                              </p>
                            </div>
                          )}
                          {isAssistantsLoading && (
                            <div className="w-full flex flex-col justify-center items-center my-7 gap-2">
                              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                              <p className="text-zinc-100 text-sm">
                                Loading Your Assistants ....
                              </p>
                            </div>
                          )}
                          {assistants?.documents
                            ?.filter(
                              (assistant) => assistant?.role !== "einsteinGPT"
                            )
                            ?.map((assistant: Models.Document) => (
                              <ul
                                className="pt-1"
                                key={assistant.$id}
                                onClick={() =>
                                  navigate(
                                    `/chat-assistant/${assistant?.assistant_id}`
                                  )
                                }
                              >
                                <li className="flex group gap-3 items-center justify-between relative px-2 py-1.5 h-full box-border rounded-lg transition-all ease-out duration-300 cursor-pointer outline-none hover:bg-zinc-800">
                                  <span className="relative flex w-[32px] h-[32px] overflow-hidden rounded-full shrink-0 grow-0">
                                    <img
                                      src={
                                        getImageUrlByName(
                                          assistant?.assistant_pretraining_name
                                        ) ||
                                        "/assets/images/assistants/placeholder.png"
                                      }
                                      alt="icon"
                                      className="h-[32px] w-[32px] object-cover object-center shrink-0 grow-0 rounded-full"
                                    />
                                  </span>
                                  <span className="flex-1 text-sm truncate font-normal text-white">
                                    <div className="w-full flex flex-row justify-between gap-1 items-center">
                                      <p className="group-hover:truncate text-white tracking-wide">
                                        {assistant?.name}
                                      </p>
                                      <div className="z-0 group relative inline-flex items-center justify-center box-border overflow-hidden">
                                        {/* chat icon */}
                                        <MessageCircle className="text-zinc-500 h-5 w-5" />
                                      </div>
                                    </div>
                                  </span>
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
                      <Button
                        className="bg-transparent border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-3 w-full text-sm z-0 group relative items-center font-normal"
                        aria-label="upgrade"
                        onClick={() => {
                          setMobileOpen(false);
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
            mobileOpen ? "hidden" : " block"
          }`}
          onClick={() => setMobileOpen(true)}
        >
          <AlignLeft className="text-zinc-400 h-7 w-7" />
        </div>
      </div>
      {/* Mobile */}
    </aside>
  );
};

export default SideBar;
