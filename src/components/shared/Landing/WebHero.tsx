import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebHero = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex flex-col xl:flex-row h-[70vh]">
      {/* left */}
      <div className="flex flex-1 flex-col w-full xl:w-1/2 justify-center bg-feature-bg bg-center bg-no-repeat h-full py-6">
        <h1 className="text-[30px] font-bold leading-[120%] lg:text-[50px]">
          Empower Your World with Personalized Assistants
        </h1>
        <p className="text-base mt-3 text-primary-black opacity-70 xl:max-w-[520px]">
          Customized virtual assistants tailored to elevate your productivity
          and streamline your operations. Experience efficiency and
          effectiveness like never before.
        </p>
        <div className="my-7 flex flex-wrap gap-5">
          <p className="text-base font-medium text-primary-blue border border-light-grey rounded-full shadow-md p-3">
            EinsteinAI
            <span className="ml-1 text-primary-black">
              is Live
            </span>
          </p>
          <div className="flex items-center gap-2">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <img src="/assets/images/star.svg" alt="star" key={index} />
              ))}
          </div>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button
            className="shad-button_primary"
            onClick={() => navigate("/sign-up")}
          >
            Start Free Trial
          </Button>
          <Button
            className="bg-white text-primary-black flex text-base border border-light-grey hover:shadow-md gap-2"
            onClick={() => navigate("/sign-in")}
          >
            <Bot className="w-5 h-5 text-primary-blue" />
            Train Assistant
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 items-start bg-light-grey h-full w-full">
        {/* demo video */}
       
      </div>
    </section>
  );
};

export default WebHero;
