import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCallback, useState } from "react";
import NavItem from "./NavItem"; 
import { Link, useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

type CreateAssistantModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const CreateAssistantModal = ({
  isOpen,
  setIsOpen,
}: CreateAssistantModalProps) => {
  const Navigate = useNavigate();
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
        <div className="text-xs md:text-sm font-semibold text-white md:text-black py-2 md:py-3 px-3 md:px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer bg-primary-black md:bg-transparent">
          Create Assistant
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="w-full flex flex-col">
          <img
            src="/assets/images/enterprisebg.png"
            alt="background"
            className="cover w-full h-full"
          />
          <div className="w-full py-5">
            <h4 className="text-4xl text-primary-black font-bold">
              Introducing the{" "}
              <span className="text-primary-blue">Virtuosos</span>
            </h4>
            <p className="text-base text-primary-black opacity-70">
              Create Specialised assistants for your business needs. Unlock the
              ability to create these advanced assistants by upgrading to our
              enterprise plan.
            </p>
            <div className="mt-3 flex items-center justify-center">
              <Button className="bg-primary-black text-white" onClick={()=> Navigate('/enterprise')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserMenu = () => {
  const Navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const { user } = useUserContext();

  const handleSignOut = () => {
    signOut();
    if (isSuccess) {
      Navigate("/sign-in");
    }
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <Link
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          to={"/my-assistants"}
        >
          My Assistants
        </Link>

        <CreateAssistantModal isOpen={openModal} setIsOpen={setOpenModal} />
        <div
          className="p-2 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md"
          onClick={toggleOpen}
        >
          <Menu />
          <Avatar>
            <AvatarImage
              src={
                user?.imageUrl ||
                "https://cloud.appwrite.io/v1/avatars/initials?name=Adebisi+Samuel&project=6555eb452897e2bc8d87"
              }
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-14 text-sm">
          <div className="flex flex-col cursor-pointer">
            <>
              <NavItem
                onClick={() => Navigate("/account")}
                label="Your account"
              />
              <NavItem onClick={() => Navigate("/files")} label="Files" />
              <NavItem onClick={()=> Navigate("/my-assistants")} label="My Assistants"/>
              <NavItem onClick={() => handleSignOut()} label="Sign Out" />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
