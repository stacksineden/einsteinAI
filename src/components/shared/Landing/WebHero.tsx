import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebHero = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center py-2 md:py-6">
      <div className="flex w-full flex-col items-center justify-center bg-feature-bg bg-center bg-no-repeat h-full py-6">
        <p className="text-sm md:text-base font-medium text-primary-blue border border-light-grey rounded-full shadow-md px-2 py-1 md:px-3 md:py-2 my-2">
          EinsteinAI
          <span className="ml-1 text-primary-black">is Live</span>
        </p>
        <h1 className="text-[30px] font-bold leading-[120%] lg:text-[80px] text-center">
          Empower Your World With Personalized Assistants.
        </h1>
        <p className="text-sm md:text-lg mt-3 text-primary-black opacity-70 xl:max-w-[60%]"> 
          Customized virtual assistants tailored to elevate your productivity
          and streamline your operations. Experience efficiency and
          effectiveness like never before.
        </p>
        <div className="my-4 flex flex-wrap gap-5"></div>

        <div className="flex flex-col w-full gap-3 sm:flex-row justify-center">
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
    </section>
  );
};

export default WebHero;

{
  /* <div className="flex items-center gap-2">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <img src="/assets/images/star.svg" alt="star" key={index} />
              ))}
          </div> */
}
