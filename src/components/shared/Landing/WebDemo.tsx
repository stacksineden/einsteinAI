const WebDemo = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-1 lg:px-20 3xl:px-0 overflow-hidden">
      <div className="rounded-3xl w-full mt-2 md:mt-7 bg-zinc-950 p-2 md:p-10">
        <div className="flex flex-col gap-2 ml-2 md:ml-4 lg:mb-0 mb-5 w-full md:w-[70%]">
          <h2 className="md:text-5xl text-2xl text-zinc-100 ">
            Take a Quick Demo:
            <span className="text-primary-blue"> See How EinsteinAI Works</span>
          </h2>
          <p className="text-zinc-400 text-base tracking-wide ml-0 md:ml-2 font-medium">
            Explore Our Powerful Features – There's no limit to what you can
            achieve or accomplish here.
          </p>
        </div>

        <div className="w-full bg-zinc-900 rounded-3xl md:h-[600px] mt-6">
          {
            <video
              src="/assets/videos/demo.mp4"
              controls
              className="w-full aspect-video h-full"
            ></video>
          }
        </div>
      </div>
    </section>
  );
};

export default WebDemo;

