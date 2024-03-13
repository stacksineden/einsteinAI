import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";
import { Button } from "@/components/ui/button";

const Enterprise = () => {
  return (
    <WebLayoutWrapper>
      {/* hero section */}
      <div className="h-[50vh] md:h-[80vh] w-full flex">
        <div className="w-full flex-1 flex-col flex my-auto px-6 gap-2">
          <h2 className="text-5xl md:text-6xl font-bold text-black">
            <span className="text-primary-blue">EinsteinAI</span> for
            Enterprise.
          </h2>
          <p className="text-base text-primary-black w-[95%] md:w-[70%] font-light">
            Develop custom assistants tailored to your unique business
            requirements to effectively address and fulfill your specific use
            case.
          </p>
          <div className="w-1/2 mt-3 ml-2">
            <Button className="bg-primary-black text-base text-white">
              Contact us
            </Button>
          </div>
        </div>
        <div className="w-full flex-1 hidden md:flex">
          <img
            src="/assets/images/gridimg.png"
            alt="assistantimage"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* sections */}
      <section className="2xl:max-w-[1440px] mx-auto relative py-1 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden bg-feature-bg bg-center bg-no-repeat">
        <h2 className="text-[35px] md:text-[40px] opacity-70 pb-1 md:pb-3">
          Let&apos;s Have it your way
        </h2>
        <p className="text-base md:text-lg text-primary-black w-full md:w-1/2 opacity-70 font-light md:font-normal">
          Welcome to EinsteinAI for Enterprise, where we empower business owners
          with the ability to shape their digital future. Our goal is to provide
          you with custom-built assistants designed to meet your unique business
          needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
          <div className="py-7 md:py-12 px-3 flex items-center hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-blue bg-blue-50">
            <div className="flex flex-col gap-2">
              <p className="text-primary-black text-lg md:text-2xl flex-1">
                Request Tailored Functionalities
              </p>
              <p className="text-base text-primary-black font-light">
                Fill out our request form to let us know the specialized
                functionalities you envision for your custom assistant. This
                will help us tailor our solutions to perfectly align with your
                business requirements.
              </p>
            </div>
          </div>
          <div className="py-7 md:py-12 px-3 flex items-center hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-red bg-red-50">
            <div className="flex flex-col gap-2">
              <p className="text-primary-black text-lg md:text-2xl flex-1">
                Request Tailored Functionalities
              </p>
              <p className="text-base text-primary-black font-light">
                Through direct conversations, we aim to gain a thorough
                understanding of your expectations, providing valuable insights
                into potential solutions. After completing the form and
                consulting with our team, we will commence the development of a
                tailored assistant aligned with your business objectives.
              </p>
            </div>
          </div>
          <div className="py-7 md:py-12 px-3 flex items-center hover:scale-105 transform transition duration-300 ease-out cursor-pointer rounded-xl text-center shadow-lg md:rounded-3xl border border-primary-yellow bg-yellow-50">
            <div className="flex flex-col gap-2">
              <p className="text-primary-black text-lg md:text-2xl flex-1">
                Seamless Integration, Ongoing Support
              </p>
              <p className="text-base text-primary-black font-light">
                Start harnessing the power of your personalized assistant
                effortlessly. Elevate your business with ease and efficiency on
                our platform.Our monthly maintenance fee of $140 ensures
                continuous support, updates, and optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* call to action */}
      <div className="my-[4rem] max-w-[98%] md:max-w-[80%] mx-auto rounded-xl md:rounded-3xl md:grid grid-cols-1 md:grid-cols-2 shadow-2xl h-[60vh] hidden">
        <div className="bg-black w-full rounded-l-[2rem] text-center flex justify-center items-center gap-3 flex-col px-6">
          <h2 className="text-white font-bold text-[28px]">
            Ignite possibilities. Contact us @ StacksinEden.
          </h2>
          <p className="text-white font-light tracking-wide text-[14px]">
            Empower with Futuristic AI. Streamline service, capture leads, boost
            productivity. Personalized interactions, efficient workflows, and
            revolutionary content. Unlock your business potential with
            stacksinEDEN's AI empowerment. Get started now!
          </p>

          <Button className="bg-white text-primary-black mt-3">
            Get started
          </Button>
        </div>
        <div className="bg-transparent w-full rounded-r-[2rem] hidden md:inline-block">
          <img
            src="/assets/images/banner.png"
            alt="bannerimage"
            className="w-full object-cover h-full rounded-r-[2rem]"
          />
        </div>
      </div>

      {/* mobiles */}
      <div className="max-w-[99%] mx-auto px-5 mt-2">
        <div className="w-full my-7 flex flex-col gap-9 py-5 md:hidden">
          <div className="w-full h-[500px] shadow-xl grid grid-cols-1 rounded-[2rem]">
            <div className="w-full bg-yellow-200  rounded-t-[2rem]">
              <img
                src="/assets/images/banner.png"
                alt="bannerimage"
                className="w-full object-cover h-full rounded-t-[2rem]"
              />
            </div>

            <div className="w-full bg-black py-5 px-7 text-white rounded-b-[2rem]">
              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[18px] font-semibold">
                    Ignite possibilities. Contact us @ StacksinEden.
                  </h2>
                  <p className="text-[12px] font-light tracking-wide">
                    Empower with Futuristic AI. Streamline service, capture
                    leads, boost productivity. Personalized interactions,
                    efficient workflows, and revolutionary content. Unlock your
                    business potential with stacksinEDEN's AI empowerment. Get
                    started now!
                  </p>
                  <div className="flex justify-start my-2">
                    <Button className="bg-white text-primary-black mt-3">
                      Get started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebLayoutWrapper>
  );
};

export default Enterprise;

{
  /* <div className="bg-white p-2 flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg text-center">
          <h2 className="text-7xl font-bold text-black">
            <span className="text-primary-blue">EinsteinAI</span> for
            Enterprise.
          </h2>
          <p className="text-base text-primary-black w-[70%]">
            Develop custom assistants tailored to your unique business
            requirements to effectively address and fulfill your specific use
            case.
          </p>
        </div> */
}
