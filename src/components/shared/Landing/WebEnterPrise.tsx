import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WebEnterPrise = () => {
  const navigate = useNavigate();
  return (
    <section className="2xl:max-w-[1440px] mx-auto relative py-4 lg:mb-5 lg:py-20 xl:mb-6 px-6 lg:px-20 3xl:px-0 overflow-hidden">
      <div className="w-full h-[500px] shadow-xl md:grid grid-cols-2 rounded-[2rem] hidden bg-primary-black">
        <div className="w-full h-full rounded-l-[2rem] py-12 pl-8 pr-2 text-white relative">
          <div className="w-full">
            <div className="flex flex-col gap-4 mt-6">
              <h2 className="text-[48px] font-semibold">
                EinsteinGPT - LIke ChatGPT{" "}
                <span className="text-primary-blue">with superpowers</span>
              </h2>
              <p className="text-[14px] font-light tracking-wide">
                <span className="font-semibold">
                  Custom-Built Business Assistants:{" "}
                </span>
                Unlock the full potential of AI chatbots with EinsteinAI. Engage
                instantly with real-time, accurate web data, PDFs, images, and
                more, all tailored to your brand's voice.
              </p>
              <div className="flex justify-start mt-2">
                <Button
                  className="bg-white text-primary-black flex text-base border border-light-grey hover:shadow-md gap-2"
                  onClick={() => navigate("/sign-up")}
                >
                  Try EinsteinGPT
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-feature-bg bg-cover bg-center bg-no-repeat h-full rounded-r-[2rem relative">
          <img
            src="/assets/images/bannerpic.png"
            alt="baner"
            className="object-contain absolute right-[100px] bottom-0 h-[450px]"
          />
        </div>
      </div>

      {/* mobile */}

      <div className="w-full  shadow-xl grid grid-cols-1 rounded-[2rem] md:hidden">
        <div className="w-full bg-primary-black py-5 px-1 md:px-7 text-white rounded-b-[2rem] h-full">
          <div className="w-full h-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-[26px] md:text-[48px] font-semibold">
                EinsteinGPT - LIke ChatGPT{" "}
                <span className="text-primary-blue">with superpowers</span>
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
                  onClick={() => navigate("/sign-up")}
                >
                    Try EinsteinGPT
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-black rounded-t-[2rem] mt-3 md:mt-0">
          <img
            src="/assets/images/bannerpic.png"
            alt="image-services"
            className="bg-cover w-full h-full rounded-t-[2rem]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default WebEnterPrise;
