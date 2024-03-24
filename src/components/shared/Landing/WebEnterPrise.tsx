import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WebEnterPrise = () => {
  const navigate = useNavigate();
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-10 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden">
      <div className="w-full h-[450px] shadow-xl md:grid grid-cols-2 rounded-[2rem] hidden">
        <div className="w-full bg-primary-black h-full rounded-l-[2rem] py-5 px-7 text-white relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[88%]">
            <div className="flex flex-col gap-4">
              <h2 className="text-[28px] font-semibold">
                <span className="text-primary-blue"> EinsteinAI</span> for
                Enterprise
              </h2>
              <p className="text-[14px] font-light tracking-wide">
                <span className="font-semibold">
                  Custom-Built Business Assistants:
                </span>{" "}
                Tailor-made for Your Enterprise. Develop advanced custom
                assistants specifically designed to meet and exceed your unique
                business needs, ensuring seamless alignment with your specific
                use case. Unlock the power of intelligence and efficiency for
                your enterprise with our specialized assistant solutions."
              </p>
              <div className="flex justify-start mt-2">
                <Button
                  className="bg-white text-primary-black flex text-base border border-light-grey hover:shadow-md gap-2"
                  onClick={() => navigate("/enterprise")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-black h-full rounded-r-[2rem]">
          <img
            src="/assets/images/banner.png"
            alt="enterpriseimage"
            className="bg-contain w-full h-full rounded-r-[2rem]"
            loading="lazy"
          />
        </div>
      </div>

      {/* mobile */}

      <div className="w-full  shadow-xl grid grid-cols-1 rounded-[2rem] md:hidden">
        <div className="w-full bg-black rounded-t-[2rem]">
          <img
            src="/assets/images/banner.png"
            alt="image-services"
            className="bg-cover w-full h-full rounded-t-[2rem]"
            loading="lazy"
          />
        </div>

        <div className="w-full bg-primary-black py-5 px-7 text-white rounded-b-[2rem] h-full">
          <div className="w-full h-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-[28px] font-semibold">
                <span className="text-primary-blue"> EinsteinAI</span> for
                Enterprise
              </h2>
              <p className="text-[14px] font-light tracking-wide">
                <span className="font-semibold">
                  Custom-Built Business Assistants:
                </span>{" "}
                Tailor-made for Your Enterprise. Develop advanced custom
                assistants specifically designed to meet and exceed your unique
                business needs, ensuring seamless alignment with your specific
                use case. Unlock the power of intelligence and efficiency for
                your enterprise with our specialized assistant solutions."
              </p>
              <div className="flex justify-start mt-2">
                <Button
                  className="bg-white text-primary-black flex text-base border border-light-grey hover:shadow-md gap-2"
                  onClick={() => navigate("/enterprise")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebEnterPrise;
