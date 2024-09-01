import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebHero = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1240px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center py-2 md:py-6"> 
      <div className="flex w-full flex-col items-center justify-center bg-feature-bg bg-contain bg-center bg-no-repeat h-full py-6">
        <p className="text-sm md:text-base font-medium text-primary-blue border border-zinc-700 rounded-full shadow-md px-2 py-1 md:px-3 md:py-2 my-2">
          EinsteinAI
          <span className="ml-1 text-zinc-100">is Live</span>
        </p>
        <h1 className="text-[30px] font-bold leading-[120%] lg:text-[45px] md:text-center text-zinc-100">
          EinsteinAI: Your Essential, Affordable, and Smarter Alternative to
          ChatGPT Plus
        </h1>
        <p className="text-sm md:text-lg mt-3 text-zinc-100 opacity-70 xl:max-w-[80%] md:text-center font-medium">
          Personalized Virtual Assistants Tailored to Elevate Your Productivity.
          Revolutionize Your Workflow with Cutting-Edge AI Technology – Faster,
          More Intelligent, and Unmatched in Affordability.
        </p>
        <div className="my-4 flex flex-wrap gap-5"></div>

        <div className="flex flex-col w-full gap-3 sm:flex-row justify-center">
          <Button
            className="shad-button_zinc"
            onClick={() => navigate("/sign-up")}
          >
            Start Free Trial
          </Button>
          <Button
            className="bg-zinc-100 text-zinc-900 flex text-base border border-light-grey hover:shadow-md gap-2"
            onClick={() => navigate("/sign-in")}
          >
            <Bot className="w-5 h-5 text-primary-blue" />
            Try EinsteinGPT
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
