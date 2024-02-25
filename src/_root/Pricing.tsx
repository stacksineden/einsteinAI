import { useState } from "react";
import WebLayoutWrapper from "@/components/shared/Landing/WebLayoutWrapper";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pricingItems } from "@/modelDataset";

const Pricing = () => {
  const navigate = useNavigate();
  const [billingFrequency, setBillingFrequency] = useState("weekly");

  return (
    <WebLayoutWrapper>
      <div className="mx-auto max-w-[1440px] px-5 md:px-20 py-20 ">
        <div className="text-center w-[90%] md:w-[70%] mx-auto">
          <h1 className="text-6xl font-bold sm:7xl text-primary-black">
            Pricing
          </h1>
          <p className="mt-5 text-primary-black text-base opacity-70">
            Whether for personal or client use, Einstein AI offers tailored
            packages. Choose your perfect plan to unlock the full potential of
            intelligent technology for impressive project elevation.
          </p>

          <div className="flex flex-col gap-3 my-5 justify-center items-center">
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
          </div>
        </div>
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pricingItems?.map((item, _i) => (
            <div
              key={_i}
              className={`relative rounded-2xl bg-white shadow-lg ${
                item?.plan === "Pro"
                  ? "border-1 border-primary-blue shadow-primary-blue"
                  : "border border-gray-200"
              }`}
            >
              {item?.plan === "Pro" && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary-black px-3 py-2 text-sm font-medium text-white text-center">
                  Most Popular
                </div>
              )}
              <div className="p-5 text-center">
                <h3 className="my-3 text-center text-3xl font-bold">
                  {item?.plan}
                </h3>
                <p className="text-primary-black opacity-70 text-base">
                  {item?.tagline}
                </p>
                <p className="my-2 text-6xl font-semibold">
                  ${billingFrequency === "weekly" && item?.base_price_weekly}
                  {billingFrequency === "monthly" && item?.base_price_monthly}
                </p>
                <p className="text-primary-black opacity-70">
                  {item?.plan !== "Free" && (
                    <>
                      {billingFrequency === "weekly" && "per week"}
                      {billingFrequency === "monthly" && "per month"}
                    </>
                  )}
                </p>
              </div>
              <ul className="my-10 space-y-5 px-8">
                {item?.features?.map((feature, _i) => (
                  <li className="flex space-x-5 text-center gap-2" key={_i}>
                    <CheckCheck className="text-primary-blue w-5 h-5" />{" "}
                    {feature?.text}
                  </li>
                ))}
              </ul>
              <div className="border-t border-t-light-grey" />
              <div className="p-5 flex items-center justify-center">
                {(item?.plan !== "Enterprise" ||
                  billingFrequency !== "weekly") && (
                  <Button
                    className="bg-primary-black text-white text-base"
                    onClick={() =>
                      item?.plan === "Enterprise"
                        ? navigate("/enterprise")
                        : navigate("/sign-in")
                    }
                  >
                    {item?.plan === "Free"
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
