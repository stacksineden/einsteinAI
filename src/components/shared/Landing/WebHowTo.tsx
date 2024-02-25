import { MoveRight } from "lucide-react";

const WebHowTo = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-1 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden bg-feature-bg bg-center bg-no-repeat">
      <h2 className="text-[24px] md:text-[40px] opacity-70 pb-1 md:pb-3">
        Ways to get started
      </h2>
      <p className="text-base md:text-lg text-primary-black w-full md:w-1/2 opacity-70">
        Whether you want to find assistants, have them come to you, or
        collaborate with your entire team, get started in just a few clicks.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
        <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-blue bg-blue-50">
          <p className="text-primary-black text-lg md:text-2xl flex-1">
            Select any Pre-Trained Assistant
          </p>
          <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
        </div>
        <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-red bg-red-50">
          <p className="text-primary-black text-lg md:text-2xl flex-1">
          Train and Configure for your use-case
          </p>
          <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
        </div>
        <div className="py-7 md:py-12 px-3 md:px-7 flex items-center gap-3 hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-yellow bg-yellow-50">
          <p className="text-primary-black text-lg md:text-2xl flex-1">
          Chat with Your Trained Assistant
          </p>
          <MoveRight className="text-primary-black h-7 w-7 md:block hidden" />
        </div>
      </div>
    </section>
  );
};

export default WebHowTo;


