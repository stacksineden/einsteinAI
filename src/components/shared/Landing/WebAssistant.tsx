import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebAssistant = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[1440px] relative flex w-full overflow-hidden bg-pattern bg-cover bg-center bg-no-repeat px-6 py-12 sm:py-24 lg:px-20 xl:max-h-[598px]">
      <div className="bg-transparent w-full">
        <h2 className="text-white text-4xl font-medium w-[90%]">
          Transforming Your Work with AI Assistants
        </h2>
        <div className="flex flex-col mt-5 gap-7 w-[90%]">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-9 w-9 text-primary-blue" />
            <p className="text-base text-white font-light">
              Access top freelancers and professional business tools for any
              project.Build your own branded marketplace of certified experts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-9 w-9 text-primary-blue" />
            <p className="text-base text-white font-light">
              Access top freelancers and professional business tools for any
              project.Build your own branded marketplace of certified experts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-9 w-9 text-primary-blue" />
            <p className="text-base text-white font-light">
              Access top freelancers and professional business tools for any
              project.Build your own branded marketplace of certified experts.
            </p>
          </div>
        </div>
        <div className="mt-9 ml-3">
          <Button
            className="bg-light-grey text-primary-black text-base"
            onClick={() => navigate("/sign-in")}
          >
            Get Started for free
          </Button>
        </div>
      </div>
      <div className="bg-transparent w-full hidden md:block">
        <img
          src="/assets/images/assistantbg.png"
          alt="assistants"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default WebAssistant;
