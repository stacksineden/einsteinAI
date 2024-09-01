import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pricingItems } from "@/modelDataset";

const Pricing = () => {
  const navigate = useNavigate();
  // const [billingFrequency, setBillingFrequency] = useState("weekly");

  return (
    <WebLayoutWrapper>
      <div className="mx-auto max-w-[1440px] px-5 md:px-20 py-20">
        <div className="text-center w-[90%] md:w-[70%] mx-auto">
          <h1 className="text-6xl font-medium sm:7xl text-zinc-100">Pricing</h1>
          <p className="mt-5 text-zinc-100 text-base opacity-70">
            Whether for personal or client use, Einstein AI offers tailored
            packages. Choose your perfect plan to unlock the full potential of
            intelligent technology for impressive project elevation.
          </p>

          {/* <div className="flex flex-col gap-3 my-5 justify-center items-center">
            <Select
              value={billingFrequency}
              onValueChange={(value) => setBillingFrequency(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select billing frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup onChange={(e) => console.log(e)}>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div> */}
        </div>
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pricingItems?.map((item, _i) => (
            <div
              key={_i}
              className={`relative rounded-2xl bg-zinc-950 shadow-lg ${
                item?.plan === "Pro"
                  ? "border-1 border-primary-blue shadow-primary-blue"
                  : "border border-zinc-950"
              }`}
            >
              {item?.plan === "Pro" && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary-black px-3 py-2 text-sm font-medium text-white text-center">
                  Recommended
                </div>
              )}
              <div className="p-5 text-center">
                <h3 className="my-3 text-center text-3xl font-bold text-zinc-100">
                  {item?.plan}
                </h3>
                <p className="text-zinc-100 opacity-70 text-base">
                  {item?.tagline}
                </p>
                <p className="my-2 text-5xl font-semibold text-zinc-100">
                  ${item?.base_price} {item?.strikethrough && <span className="line-through text-zinc-400 text-4xl">${item?.strikethrough}</span>}
                </p>
                <p className="text-zinc-100 opacity-70">
                  {item?.frequency}
                </p>
              </div>
              <ul className="my-10 space-y-5 px-8">
                {item?.features?.map((feature, _i) => (
                  <li
                    className="flex space-x-5 text-center gap-2 text-zinc-100"
                    key={_i}
                  >
                    <CheckCheck className="text-primary-blue w-5 h-5" />{" "}
                    {feature?.text}
                  </li>
                ))}
              </ul>
              <div className="border-t border-t-zinc-900" />
              <div className="p-5 flex items-center justify-center">
                {item?.plan !== "Enterprise" && (
                  <Button
                    className="bg-zinc-900 text-white text-base"
                    onClick={() =>
                      item?.plan === "Enterprise"
                        ? navigate("/enterprise")
                        : navigate("/sign-in")
                    }
                  >
                    {item?.plan === "DayDash"
                      ? "Get Started"
                      : item?.plan === "Enterprise"
                      ? "Talk to Us"
                      : "Upgrade"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WebLayoutWrapper>
  );
};

export default Pricing;
