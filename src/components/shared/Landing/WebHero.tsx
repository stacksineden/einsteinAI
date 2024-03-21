import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebHero = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex flex-col xl:flex-row h-[70vh]">
      {/* left */}
      <div className="flex flex-1 flex-col w-full xl:w-1/2 my-auto py-10 md:py-0">
        <h1 className="text-[30px] font-bold leading-[120%] lg:text-[50px]">
          Empower Your World with Personalized Assistants
        </h1>
        <p className="text-base mt-3 text-primary-black opacity-70 xl:max-w-[520px]">
          Customized virtual assistants tailored to elevate your productivity
          and streamline your operations. Experience efficiency and
          effectiveness like never before.
        </p>
        <div className="my-7 flex flex-wrap gap-5">
          <p className="text-base font-bold lg:text-lg text-primary-blue border border-light-grey rounded-full shadow-md p-3">
            EinsteinAI
            <span className="text-base lg:text-xl ml-1 text-primary-black">
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

      <div className="relative flex flex-1 items-start bg-light-grey h-full w-full">
        {/* demo video */}
        {/* <div className="relative z-20 w-[270px] flex-col gap-8 rounded-3xl bg-light-grey px-4 py-7">
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
        </div> */}
      </div>
    </section>
  );
};

export default WebHero;
