const WebDemo = () => {
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden">
      <h2 className="lg:text-5xl md:text-5xl text-2xl lg:mb-0 mb-5  text-black w-[80%] md:w-[50%]">
        Take a Quick Demo:
        <span className="text-primary-blue">See How EinsteinAI Works</span>
      </h2>
      <div className="bg-black rounded-3xl w-full mt-2 md:mt-7">
        <video
          src="/assets/videos/demo.mp4"
          controls
          className="w-full aspect-video" 
        ></video>
      </div>
    </section>
  );
};

export default WebDemo;
