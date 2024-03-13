import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebHero = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex flex-col gap-20 py-10 pb-10 md:gap-28 lg:py-20 xl:flex-row">
      <div className="absolute right-0 top-0 h-screen w-screen bg-pattern-2 bg-cover bg-center md:-right-28 xl:-top-60"></div>
      {/* left */}
      <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
        <h1 className="text-[52px] font-bold leading-[120%] lg:text-[64px]">
          Your Gateway to Smart Assistance.
        </h1>
        <p className="text-base mt-3 text-primary-black opacity-70 xl:max-w-[520px]">
          Our platform utilizes cutting-edge AI technology, allowing you to
          train your assistants based on custom knowledge and specialized
          functions
        </p>
        <div className="my-7 flex flex-wrap gap-5">
          <div className="flex items-center gap-2">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <img src="/assets/images/star.svg" alt="star" key={index} />
              ))}
          </div>
          <p className="text-base font-bold lg:text-xl text-primary-blue">
            198k
            <span className="text-base lg:text-xl ml-1 text-primary-black">
              Active users
            </span>
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button
            className="bg-primary-blue text-light-grey flex text-base hover:opacity-90"
            onClick={() => navigate("/sign-up")}
          >
            Get started
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

      <div className="relative flex flex-1 items-start">
        <div className="relative z-20 w-[270px] flex-col gap-8 rounded-3xl bg-light-grey px-4 py-7">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1 w-full">
                <img
                  src="/assets/images/assistants/henry.png"
                  alt="user"
                  className="h-8 w-8 rounded-full bg-light-grey"
                  loading="lazy"
                />
                <p className="text-sm text-primary-black">You</p>
              </div>
              <div className="w-full bg-white text-sm text-primary-black p-2 rounded-lg">
                How far is Minneapolis from St. Paul?
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1 w-full justify-end">
                <img
                  src="/assets/images/assistants/eddy.png"
                  alt="user"
                  className="h-8 w-8 rounded-full bg-light-grey"
                  loading="lazy"
                />
                <p className="text-sm text-primary-black">Eddy</p>
              </div>
              <div className="w-full bg-primary-blue text-sm text-white p-2 rounded-lg">
                The driving distance between downtown Minneapolis and downtown
                St. Paul is approximately 10 miles (16 kilometers)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebHero;
