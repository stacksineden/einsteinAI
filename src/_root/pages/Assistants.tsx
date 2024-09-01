import { useEffect } from "react";
import CardSkeleton from "@/components/shared/CardSkeleton";
import MyAssistantsCard from "@/components/shared/MyAssistantsCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserAssistants } from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";
import { Ghost } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";

const Assistants = () => {
  const { user, checkAuthUser } = useUserContext();
  const navigate = useNavigate();


  useEffect(() => {
    checkAuthUser();
  }, [user?.id]);

  const {
    data: assistants,
    isPending: isAssistantsLoading,
    isError: isErrorAssistants,
  } = useGetUserAssistants(user?.id);

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col px-4 sm:px-8 pt-6">
        <div className="max-w-7xl self-center w-full">
          <div className="mt-0 md:mt-2 flex justify-end md:justify-between gap-4 border-b border-gray-700 pb-5 items-center px-3 md:px-4">
            <h1 className="mb-3 font-bold text-xl md:text-3xl text-zinc-100 hidden md:block">
              My Assistants
            </h1>
            <Button
              className={buttonVariants({
                size: "lg",
                className: "bg-primary-black text-white rounded-md",
              })}
              onClick={() => navigate("/create-assistant")}
            >
              Create Assistant
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6 md:p-0">
          {assistants?.documents &&
            assistants?.documents
              ?.filter((assistant) => assistant?.role !== "einsteinGPT")
              ?.map((assistant: Models.Document) => (
                <MyAssistantsCard key={assistant?.$id} data={assistant} />
              ))}
          {isAssistantsLoading && <CardSkeleton card_number={10} />}
        </div>
        {assistants?.documents?.length == 0 && (
          <div className="mt-20 flex flex-col items-center gap-2 justify-center">
            <Ghost className="h-8 w-8 text-zinc-100" />
            <h3 className="font-semibold text-xl text-zinc-100">
              Pretty empty around here
            </h3>
            <p className="text-zinc-400">
              Let&apos;s{" "}
              <Link to={"/app"} className="text-primary-blue">
                create
              </Link>{" "}
              your first Assistant.
            </p>
          </div>
        )}
        {isErrorAssistants && (
          <div className="mt-20 flex flex-col items-center gap-2 justify-center">
            <Ghost className="h-8 w-8 text-zinc-100" />
            <h3 className="font-semibold text-xl text-primary-red">
              Error getting Assistants
            </h3>
            <p>
              Please
              <Link to={"/app"} className="text-primary-blue">
                navigate
              </Link>
              back to App, or relaod the page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistants;
