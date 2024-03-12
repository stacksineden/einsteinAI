import { AssistantModel } from "@/modelDataset";
// import Favourites from "./Favourites";
import { getLevelColor, truncateText } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const AssistantCard = ({ data }: AssistantCardProps) => {
  const { userSubscriptionDetails } = useUserContext();
  return (
    <Link
      className="col-span-1 cursor-pointer group shadow-md px-2 py-3 rounded-lg"
      to={
        userSubscriptionDetails?.is_subscribed && data?.level !== "Rookie"
          ? `/pretrained-assistant/${data?.id!}`
          : userSubscriptionDetails?.is_subscribed && data?.level === "Rookie"
          ? `/pretrained-assistant/${data?.id!}`
          : !userSubscriptionDetails?.is_subscribed && data?.level === "Rookie"
          ? `/pretrained-assistant/${data?.id!}`
          : !userSubscriptionDetails?.is_subscribed && data?.level !== "Rookie"
          ? "/account"
          : "/account"
      }
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-light-grey">
          <img
            src={data?.imageUrl!}
            alt="assistant"
            className="object-cover w-full h-full group-hover:scale-110 transition"
          />
          {/* <div className="absolute top-3 right-3">
            <Favourites assistantId={data?.id!} />
          </div> */}
        </div>
        <div className="font-medium text-sm text-primary-black">
          {data?.name}{" "}
          <span className="text-base text-primary-blue truncate">
            {data?.role}
          </span>
        </div>
        <div className="font-normal text-sm text-primary-black">
          {truncateText(data?.pitch!, 80)}
        </div>
        <div className="flex justify-between items-center px-1">
          {/* <p className="text-sm font-semibold text-primary-black">14k Hires</p> */}
          <div
            className={`text-xs font-semibold ${getLevelColor(
              data?.level!
            )} bg-light-grey py-1 px-2 rounded-md uppercase`}
          >
            {data?.level}
          </div>
          <div
            className="bg-primary-black text-primary-yellow text-sm py-1 px-2 rounded-md font-medium"
          >
            Train
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssistantCard;

type AssistantCardProps = {
  data?: AssistantModel;
};
