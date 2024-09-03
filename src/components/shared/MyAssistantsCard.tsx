import { useState } from "react";
import {
  getAssistantClassifier,
  getAssistantLevel,
  truncateText,
} from "@/lib/utils";
import { getImageUrlByName } from "@/modelDataset";
import { Models } from "appwrite";
import { Loader2, PenSquare, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteAssistantOpenAI } from "@/lib/openAI/api";
import toast from "react-hot-toast";
import { useDeleteAssistantInDB } from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

type DeleteAssistantModal = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  assistant_id: string;
  assistant_db_id: string;
};

const DeleteAssitantModal = ({
  isOpen,
  setIsOpen,
  assistant_id,
  assistant_db_id,
}: DeleteAssistantModal) => {
  const { mutateAsync: deleteAssistant, isPending: isDeletingAssistant } =
    useDeleteAssistantInDB();

  const handleDeletAssistant = async () => {
    if (!assistant_id) return;
    const response = await deleteAssistantOpenAI(assistant_id);
    if (response) {
      toast.success("Your Assistant is successfully deleted.");

      // handle appwrite deletion
      const deletedAssistantInDB = await deleteAssistant(assistant_db_id);
      if (deletedAssistantInDB) {
        toast.success("Your Assistant is successfully deleted.");
        setIsOpen(false);
      }
      if (!deletedAssistantInDB) {
        return toast.error("Unable to delete assistant!");
      }
    }
    if (!response) {
      return toast.error("Unable to delete assistant!");
    }
  };
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
        <div className="text-xs font-semibold py-2 px-3 rounded-md uppercase shadow-md">
          <Trash className="h-4 w-4 text-primary-red" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="text-center p-4 flex flex-col gap-2 items-center justify-center">
          <div className="h-24 w-24">
            <img
              src="/assets/images/question.png"
              alt="assistantimage"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="font-medium text-lg text-zinc-100">
            Are you sure you want to delete assistant?
          </h2>
          <div className="w-full flex items-center gap-4 justify-center mt-2">
            <Button
              className="bg-primary-black hover:opacity-90 flex gap-2 text-white"
              aria-label="send message"
              onClick={() => handleDeletAssistant()}
            >
              {isDeletingAssistant ? (
                <div className="flex-center gap-2">
                  <Loader2 className="h-4 w-4 text-zinc-100 animate-spin" />
                </div>
              ) : (
                "Yes"
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

const MyAssistantsCard = ({ data }: MyAssistantCardProps) => {
  const navigate = useNavigate();

  const { userSubscriptionDetails } = useUserContext();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setOpenPaymentModal } = useAppContext();

  // {getAssistantLevel(data?.assistant_pretraining_name!)}

  return (
    <div className="col-span-1 cursor-pointer group shadow-md px-2 py-3 rounded-lg">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-zinc-800">
          <img
            src={
              getImageUrlByName(data?.assistant_pretraining_name) ||
              "/assets/images/assistants/placeholder.png"
            }
            alt="assistant"
            className="object-cover w-full h-full group-hover:scale-110 transition"
          />
        </div>
        <div className="font-medium text-xs text-zinc-100">
          {data?.name}{" "}
          <span className="text-sm text-primary-blue">{data?.role}</span>
        </div>
        <div className="font-normal text-xs text-zinc-100">
          {truncateText(data?.instructions!, 80)}
        </div>
        <div className="flex items-center gap-1 px-1 cursor-pointer">
          <div
            className="text-xs font-semibold text-zinc-100 bg-primary-black py-2 px-4 rounded-md uppercase"
            onClick={() => {
              userSubscriptionDetails?.is_subscribed &&
              getAssistantLevel(data?.assistant_pretraining_name!) !== "Rookie"
                ? navigate(`/chat-assistant/${data?.assistant_id}`)
                : userSubscriptionDetails?.is_subscribed &&
                  getAssistantLevel(data?.assistant_pretraining_name!) ===
                    "Rookie"
                ? navigate(`/chat-assistant/${data?.assistant_id}`)
                : !userSubscriptionDetails?.is_subscribed &&
                  getAssistantLevel(data?.assistant_pretraining_name!) ===
                    "Rookie"
                ? navigate(`/chat-assistant/${data?.assistant_id}`)
                : !userSubscriptionDetails?.is_subscribed &&
                  getAssistantLevel(data?.assistant_pretraining_name!) !==
                    "Rookie"
                ? setOpenPaymentModal(true)
                : setOpenPaymentModal(true);
            }}
          >
            Chat
          </div>
          {userSubscriptionDetails?.is_subscribed &&
            getAssistantClassifier(data?.assistant_pretraining_name!) ===
              "agent" && (
              <div
                className="text-xs font-semibold py-2 px-3 rounded-md uppercase shadow-md"
                onClick={() => {
                  userSubscriptionDetails?.is_subscribed &&
                  getAssistantLevel(data?.assistant_pretraining_name!) !==
                    "Rookie"
                    ? navigate(
                        `/edit-assistant/${data?.assistant_id}/${data?.$id}`
                      )
                    : userSubscriptionDetails?.is_subscribed &&
                      getAssistantLevel(data?.assistant_pretraining_name!) ===
                        "Rookie"
                    ? navigate(
                        `/edit-assistant/${data?.assistant_id}/${data?.$id}`
                      )
                    : !userSubscriptionDetails?.is_subscribed &&
                      getAssistantLevel(data?.assistant_pretraining_name!) ===
                        "Rookie"
                    ? navigate(
                        `/edit-assistant/${data?.assistant_id}/${data?.$id}`
                      )
                    : !userSubscriptionDetails?.is_subscribed &&
                      getAssistantLevel(data?.assistant_pretraining_name!) !==
                        "Rookie"
                    ? setOpenPaymentModal(true)
                    : setOpenPaymentModal(true);
                }}
              >
                <PenSquare className="h-4 w-4 text-zinc-100" />
              </div>
            )}

          {userSubscriptionDetails?.is_subscribed && (
            <DeleteAssitantModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              assistant_id={data?.assistant_id}
              assistant_db_id={data?.$id!}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAssistantsCard;

type MyAssistantCardProps = {
  data?: Models.Document;
};
