import CardSkeleton from "@/components/shared/CardSkeleton";
import Container from "@/components/shared/Container";
import MyAssistantsCard from "@/components/shared/MyAssistantsCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserAssistants } from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";
import { Ghost } from "lucide-react";

import { Link } from "react-router-dom";

const Assistants = () => {
  const { user } = useUserContext();

  const {
    data: assistants,
    isPending: isAssistantsLoading,
    isError: isErrorAssistants,
  } = useGetUserAssistants(user?.id);

  //   console.log(assistants, "assistants");
  return (
    <Container>
      <h1 className="mb-3 font-bold text-2xl md:text-4xl text-primary-black">
        My Assistants
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6 md:p-0">
        {assistants?.documents &&
          assistants?.documents?.map((assistant: Models.Document) => (
            <MyAssistantsCard key={assistant?.$id} data={assistant} />
          ))}
        {isAssistantsLoading && <CardSkeleton card_number={10} />}
      </div>
      {assistants?.documents?.length == 0 && (
        <div className="mt-20 flex flex-col items-center gap-2 justify-center">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>
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
          <Ghost className="h-8 w-8 text-zinc-800" />
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
    </Container>
  );
};

export default Assistants;
