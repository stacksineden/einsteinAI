import { useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import { useUserContext } from "@/context/AuthContext";
import {
  enterprisePlan,
  freePlanFeatures,
  pricingItems,
  proPlanFeatures,
} from "@/modelDataset";
import { BadgeCheck, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateUserSubscription,
  useGetFlutterwavePaymentPlans,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Skeleton from "react-loading-skeleton";
import { useToast } from "@/components/ui/use-toast";

interface PaymentPlan {
  id: number;
  name: string;
  amount: number;
  interval: string;
  duration: number;
  status: string;
  currency: string;
  plan_token: string;
  created_at: string;
}

const UserAccount = () => {
  // User Information
  const { user, isEmailVerified, userSubscriptionDetails } = useUserContext();

  const { toast } = useToast();
  const {
    mutateAsync: createSubscritpion,
    isPending: isCreatingUserSubscription,
  } = useCreateUserSubscription();

  // console.log(user, "useruseruseruser");
  console.log(userSubscriptionDetails, "userSubscriptionDetails");

  // Billing Information
  const [billingFrequency, setBillingFrequency] = useState("weekly");
  const [currency, setCurrency] = useState("NGN");

  // Flutterwave Payment Plans
  const {
    data: paymentPlans,
    isLoading: isLoadingPaymentPlans,
    isError,
  } = useGetFlutterwavePaymentPlans();
  const paymentPlansArray: PaymentPlan[] | undefined = paymentPlans;
  const [planObject, setPlanObject] = useState<PaymentPlan | undefined>(
    undefined
  );

  const getPlan = (frequency: string, selectedCurrency: string) => {
    const planDetails = paymentPlansArray?.find(
      (plan) =>
        plan?.interval?.toLowerCase() === frequency &&
        plan?.currency === selectedCurrency
    );
    setPlanObject(planDetails);
    return planDetails;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoadingPaymentPlans && !isError) {
        const planDetails = getPlan(billingFrequency, currency);
        setPlanObject(planDetails);
      }
    };

    fetchData();
  }, [billingFrequency, currency, isLoadingPaymentPlans, isError]);

  const navigate = useNavigate();

  // Flutterwave configuration
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY_TEST,
    tx_ref: Date.now().toString(),
    amount: planObject?.amount!,
    currency: planObject?.currency! || "NGN",
    payment_options: "card",
    payment_plan: String(planObject?.id!),
    customer: {
      email: user?.email!,
      phone_number: "",
      name: user?.name!,
    },
    customizations: {
      title: `Payment for pro ${planObject?.interval} plan`,
      description: `Payment for pro ${planObject?.interval} plan`,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Container>
      <div className="mt-0 md:mt-2 flex flex-col gap-2 border-b border-gray-200 pb-1 px-3 md:px-2">
        <h1 className="font-bold mb-5 text-2xl md:text-4xl text-primary-black">
          Account Information
        </h1>
      </div>
      <div className="px-5 flex gap-5 flex-col md:flex-row mt-3">
        <div className="w-full md:w-[30%] mt-5 p-7">
          <div className="flex items-center justify-between">
            <div className="w-20 h-20 rounded-full bg-light-grey">
              <img
                src={
                  user?.imageUrl || "/assets/images/assistants/placeholder.png"
                }
                alt="image"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {isEmailVerified && (
              <div className="flex flex-col gap-1 justify-center items-center">
                <BadgeCheck className="h-10 w-10 text-white bg-primary-blue p-2 rounded-full" />
                <p className="text-sm text-primary-black font-medium">
                  Email Verified
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 my-4 mx-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-primary-black">
                Full name
              </p>
              <p className="text-sm text-primary-black opacity-80">
                {user?.name}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-primary-black">Email</p>
              <p className="text-sm text-primary-black opacity-80">
                {user?.email}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-primary-black">
                Current subcription plan
              </p>
              <p className="text-sm text-primary-black opacity-80">
                {userSubscriptionDetails?.is_subscribed ? "Pro Plan" : "Free"}
              </p>
            </div>
          {userSubscriptionDetails?.is_subscribed && (
              <div className="flex flex-col">
              <Button className="bg-primary-red text-white text-base mt-2">
                Cancel Subscription
              </Button>
            </div>
          )}
          </div>
        </div>

        <div className="flex-1 p-5 border border-light-grey shadow-md">
          <p className="text-primary-black opacity-70 text-lg font-medium">
            Billing Information
          </p>
          <div className="flex gap-3 my-1 justify-center items-center">
            {/* <p className="text-sm text-primary-black font-medium">
              Billing frequeny
            </p> */}
            <Select
              value={billingFrequency}
              onValueChange={(value) => setBillingFrequency(value)}
            >
              <SelectTrigger className="w-[100px] md:w-[200px]">
                <SelectValue placeholder="Select billing frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup onChange={(e) => console.log(e)}>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              <SelectTrigger className="w-[100px] md:w-[200px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup onChange={(e) => console.log(e)}>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`relative rounded-2xl shadow-lg`}>
              <div className="p-1 text-center">
                <h3 className="my-1 text-center text-xl font-bold">Free</h3>
                <p className="text-primary-black opacity-70 text-sm">
                  For starters to try out
                </p>
                <p className="my-1 text-4xl font-semibold">0</p>
                <p className="text-primary-black opacity-70">Per month</p>
              </div>
              <ul className="my-3 space-y-2 px-3">
                {freePlanFeatures?.map((feature, _i) => (
                  <li
                    className="flex space-x-5 text-center gap-2 text-sm"
                    key={_i}
                  >
                    <CheckCheck className="text-primary-blue w-4 h-4" />
                    {feature?.text}
                  </li>
                ))}
              </ul>
              <div className="border-t border-t-light-grey" />
              <div className="p-5 flex items-center justify-center">
                {/* <Button
                  className="bg-primary-black text-white text-sm"
                  onClick={() => {}}
                >
                  Upgrade
                </Button> */}
              </div>
            </div>

            {/* pro plans */}
            <div
              className={`relative rounded-2xl shadow-lg border-1 border-primary-blue shadow-primary-blue`}
            >
              <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-primary-black px-3 py-1 text-sm font-medium text-white text-center">
                Most Popular
              </div>

              <div className="p-1 text-center">
                <h3 className="my-1 text-center text-xl font-bold">Pro</h3>
                <p className="text-primary-black opacity-70 text-sm">
                  For Optimum personal needs
                </p>
                <p className="my-1 text-4xl font-semibold">
                  {planObject?.currency} {planObject?.amount}
                </p>
                <p className="text-primary-black opacity-70">
                  {planObject?.interval === "weekly" ? "Per Week" : "Per Month"}
                </p>
              </div>
              <ul className="my-3 space-y-2 px-3">
                {proPlanFeatures?.map((feature, _i) => (
                  <li
                    className="flex space-x-5 text-center gap-2 text-sm"
                    key={_i}
                  >
                    <CheckCheck className="text-primary-blue w-4 h-4" />
                    {feature?.text}
                  </li>
                ))}
              </ul>
              <div className="border-t border-t-light-grey" />
              <div className="p-5 flex items-center justify-center">
                {userSubscriptionDetails?.is_subscribed ? (
                  <div className="p-2 rounded-lg bg-light-grey text-base font-medium text-black">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    className="bg-primary-black text-white text-sm"
                    onClick={() => {
                      // console.log(
                      //   planObject?.id,
                      //   planObject?.currency,
                      //   planObject?.interval,
                      //   planObject?.amount
                      // );
                      handleFlutterPayment({
                        callback: async (response) => {
                          console.log(response, "payment res");
                          //send this to appwrite to create a subscription
                          if (response) {
                            const paymentPayload = {
                              user_id: user?.id!,
                              is_subscribed:
                                response?.status === "successful"
                                  ? true
                                  : false,
                              amount: response?.amount!,
                              currency: response?.currency!,
                              subscription_start_date: new Date().toISOString(),
                              user_email: response?.customer?.email!,
                              transaction_id: response?.transaction_id!,
                              tx_ref: response?.tx_ref!,
                            };
                            const createSubscription = await createSubscritpion(
                              paymentPayload
                            );
                            if (createSubscription) {
                              toast({
                                description:
                                  "Hey Champ! Your have successfully subsribed to the pro plan",
                                className: "bg-primary-blue text-white",
                              });
                              //handle redirection
                              navigate("/my-assistants");
                            }
                            if (!createSubscription) {
                              //we need to get the user payment details from flutterwave and resolve the issue if they successfully paid
                              toast({
                                title:
                                  "Unable to save Subcription details, please contact us, let's help you figure this out asap",
                                description:
                                  "Something went wrong, Don't panic, It will be resolved",
                                className: "bg-red-200 text-white",
                              });
                              navigate("/my-assistants");
                            }
                          }
                          if (!response) {
                            //definetely and issuw from flutterwave, we can still get their payment details and help them verify with flutterwave but definetly not on us
                            toast({
                              title: "Payment Unsuccessful",
                              description: "Something went wrong",
                              className: "bg-red-200 text-white",
                            });
                          }
                          closePaymentModal(); // this will close the modal programmatically
                        },
                        onClose: () => {},
                      });
                    }}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </div>

            {/* enterprise */}
            <div className={`relative rounded-2xl shadow-lg`}>
              <div className="p-1 text-center">
                <h3 className="my-1 text-center text-xl font-bold">
                  Enterprise
                </h3>
                <p className="text-primary-black opacity-70 text-sm">
                  For larger projects with a specific use case
                </p>
                <p className="my-1 text-4xl font-semibold">Custom</p>
                {/* <p className="text-primary-black opacity-70">Per Month</p> */}
              </div>
              <ul className="my-3 space-y-2 px-3">
                {enterprisePlan?.map((feature, _i) => (
                  <li
                    className="flex space-x-5 text-center gap-2 text-sm"
                    key={_i}
                  >
                    <CheckCheck className="text-primary-blue w-4 h-4" />
                    {feature?.text}
                  </li>
                ))}
              </ul>
              <div className="border-t border-t-light-grey" />
              <div className="p-5 flex items-center justify-center">
                <Button
                  className="bg-primary-black text-white text-sm"
                  onClick={() => {}}
                >
                  Talk to us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserAccount;
