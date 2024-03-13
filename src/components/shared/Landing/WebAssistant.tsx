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
              Customize AI for precise expertise in diverse fields. Tailor
              assistants to align with your unique use-cases effectively.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-9 w-9 text-primary-blue" />
            <p className="text-base text-white font-light">
              Effortlessly integrate AI assistants for efficient, collaborative,
              and intelligent workflow enhancement.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-9 w-9 text-primary-blue" />
            <p className="text-base text-white font-light">
              EinsteinAI transforms tasks, offering smart assistance for
              enhanced efficiency in every aspect of your life.
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
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default WebAssistant;
