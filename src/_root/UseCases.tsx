import { useState } from "react";
import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";
import { useCasesData } from "@/modelDataset";
import { truncateText } from "@/lib/utils";

interface UseCasesDataObj {
  title: string;
  description: string;
  benefits: string[];
  image: string;
}

const UseCases = () => {
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<UseCasesDataObj | null>(
    null
  );

  return (
    <WebLayoutWrapper>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-zinc-800/40 backdrop-blur-sm`}
            onClick={() => setOpen(false)}
          ></div>
          <div
            className={`relative z-10 bg-white px-8 py-6 md:py-8 rounded-lg shadow-lg w-[90%] md:w-[800px] h-[65vh] overflow-y-scroll scrollbar-hide`}
          >
            <div className="flex flex-col gap-4 text-[#071E22]">
              <h2 className="text-[20px] md:text-[24px] font-medium">
                {filteredData?.title}
              </h2>
              <p className="text-[12px] md:text-[14px] font-light tracking-wide">
                {filteredData?.description}
              </p>
              <ul className="font-normal tracking-wide mt-2 text-[12px] list-disc space-y-4 ml-3">
                {filteredData?.benefits.map((benefit, _i) => (
                  <li key={_i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[1440px] px-5 md:px-20 py-20">
        <div className="text-center flex flex-col gap-1 md:gap-2">
          <div className="max-w-[80%] mx-auto py-2">
            <h2 className="font-medium text-[24px] md:text-[40px] text-primary-black max-w-[98%] md:max-w-[70%] mx-auto">
              Unleash Boundless Brilliance with{" "}
              <span className="text-primary-blue">EinsteinAI</span> Alchemy.
            </h2>
          </div>
          <div className="text-primary-black text-sm md:text-base w-[90%] md:w-[70%] mx-auto opacity-80">
            Discover the power of our AI Assistants across various scenarios.
            Explore how our versatile templates can be customized to elevate
            your personal and business experiences.Stay tuned for continuous
            advancements, as we are always building and introducing more
            assistants with increasingly complex functions to further enhance
            your interactions.
          </div>
        </div>

        <div className="w-full my-7 hidden md:flex flex-col gap-9 px-20 py-5">
          {useCasesData &&
            useCasesData?.map((caseData, _i) => (
              <div
                className="w-full h-[450px] shadow-xl grid grid-cols-2 rounded-[2rem]"
                key={_i}
              >
                <div className="w-full bg-primary-black h-full rounded-l-[2rem] py-5 px-7 text-white relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[88%]">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-[28px] font-semibold">
                        {caseData.title}
                      </h2>
                      <p className="text-[14px] font-light tracking-wide">
                        {caseData.description}
                      </p>
                      <div className="flex justify-start mt-2">
                        <button
                          className="text-[12px] md:text-[14px] text-[#071E22] cursor-pointer tracking-tight font-semibold bg-white px-4 md:px-4 py-2 md:py-2 active:scale-90 rounded-full border-[1px] border-[#e5e5e5] transition-all ease-in-out duration-300 shadow-lg"
                          onClick={() => {
                            setFilteredData(caseData);
                            setOpen(true);
                          }}
                        >
                          Learn more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-black h-full rounded-r-[2rem]">
                  <img
                    src={caseData?.image}
                    alt="image-services"
                    className="bg-contain w-full h-full rounded-r-[2rem]"
                  />
                </div>
              </div>
            ))}
        </div>

        {/* mobiles  */}

        <div className="w-full my-7 flex flex-col gap-9 py-5 md:hidden">
          {useCasesData &&
            useCasesData.map((caseData, _i) => (
              <div
                className="w-full h-[500px] shadow-xl grid grid-cols-1 rounded-[2rem]"
                key={_i}
              >
                <div className="w-full bg-yellow-200 h-[250px] rounded-t-[2rem]">
                  <img
                    src={caseData?.image}
                    alt="image-services"
                    className="bg-cover w-full h-full rounded-t-[2rem]"
                  />
                </div>

                <div className="w-full bg-[#071E22] h-[250px] py-5 px-7 text-white rounded-b-[2rem]">
                  <div className="w-full">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[18px] font-semibold">
                        {caseData?.title}
                      </h2>
                      <p className="text-[12px] font-light tracking-wide">
                        {truncateText(caseData?.description, 180)}
                      </p>
                      <div className="flex justify-start mt-2">
                        <button
                          className="text-[12px] md:text-[14px] text-[#071E22] cursor-pointer tracking-tight font-semibold bg-white px-3 py-1 active:scale-90 rounded-full border-[1px] border-[#e5e5e5] transition-all ease-in-out duration-300 shadow-lg"
                          onClick={() => {
                            setFilteredData(caseData);
                            setOpen(true);
                          }}
                        >
                          Learn more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </WebLayoutWrapper>
  );
};

export default UseCases;
