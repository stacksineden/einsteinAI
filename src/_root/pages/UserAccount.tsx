
//legacy 

import { useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import { useUserContext } from "@/context/AuthContext";
import {
  dayDashPlan,
  enterprisePlan,
  // freePlanFeatures,
  // pricingItems,
  proPlanFeatures,
} from "@/modelDataset";
import { CheckCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  useUpdateUserSubscriptionDetails,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ISubscription, IUser } from "@/types";
import { formatDateString } from "@/lib/utils";

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

interface DayDashPlan {
  id: number;
  name: string;
  amount: number;
  currency: string;
}
type PaymentModalProps = {
  user: IUser;
  userSubscriptionDetails: ISubscription;
};

const PaymentModal = ({ user, userSubscriptionDetails }: PaymentModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Billing Information
  const [billingFrequency, setBillingFrequency] = useState("hourly");
  const [currency, setCurrency] = useState("USD");

  const { toast } = useToast();

  const { mutateAsync: createSubscritpion } = useCreateUserSubscription();
  const { mutateAsync: updateSubcription } = useUpdateUserSubscriptionDetails();

  // console.log(user, "useruseruseruser");
  // console.log(userSubscriptionDetails, "userSubscriptionDetails");

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

  const [dayDashPlanObject, setDayDashPlanObject] = useState<
    DayDashPlan | undefined
  >(undefined);

  // console.log(paymentPlans, "plans");

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
    if (billingFrequency === "hourly") {
      const planDetails = {
        id: 67899,
        name: "DayDash Plan",
        amount: currency === "USD" ? 0.99 : 1130,
        currency,
      };
      setDayDashPlanObject(planDetails);
      setPlanObject(undefined); // Reset planObject when billingFrequency is "hourly"
      return;
    }

    const fetchData = async () => {
      if (!isLoadingPaymentPlans && !isError) {
        const planDetails = getPlan(billingFrequency, currency);
        setPlanObject(planDetails);
      }
    };

    fetchData();
  }, [billingFrequency, currency, isLoadingPaymentPlans, isError]);

  const navigate = useNavigate();

  // console.log(user, "user details");

  // Flutterwave configuration
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: planObject ? planObject?.amount! : dayDashPlanObject?.amount!,
    currency: planObject ? planObject?.currency! : dayDashPlanObject?.currency!,
    payment_options:
      billingFrequency === "hourly" ? "card, banktransfer, ussd" : "card",
    payment_plan:
      billingFrequency !== "hourly" ? String(planObject?.id!) : undefined,
    customer: {
      email: user?.email!,
      phone_number: "",
      name: user?.name!,
    },
    customizations: {
      title: `Payment for pro ${
        planObject ? planObject?.interval : "DayDash"
      } plan`,
      description: `Payment for pro ${
        planObject ? planObject?.interval : "DayDash"
      } plan`,
      logo: "https://res.cloudinary.com/dyryfgjro/image/upload/v1710761978/rgia6ac2ctfrsol6rlld.jpg",
    },
  };

  // console.log(config, "config");

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          className={buttonVariants({
            size: "sm",
            className: "bg-primary-black text-white rounded-md",
          })}
        >
          {userSubscriptionDetails?.is_subscribed
            ? "Change Plan"
            : "Upgrade to Pro"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className=" p-5">
          <div className="flex gap-3 my-1 justify-center items-center">
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
                  <SelectItem value="hourly">DayDash</SelectItem>
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

          <div className="pt-12 grid grid-cols-1 gap-5">
            {/* pro plans */}
            <div
              className={`relative rounded-2xl shadow-lg border-1 border-primary-blue shadow-primary-blue`}
            >
              {/* <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-primary-black px-3 py-1 text-sm font-medium text-white text-center">
                Most Popular
              </div> */}

              <div className="p-1 text-center">
                <h3 className="my-1 text-center text-xl font-bold">Pro</h3>
                <p className="text-primary-black opacity-70 text-sm">
                  For Optimum personal needs
                </p>
                {isLoadingPaymentPlans && billingFrequency !== "hourly" && (
                  <p className="text-base text-primary-black">
                    Loading Payement plans ...
                  </p>
                )}
                {isError && billingFrequency !== "hourly" && (
                  <p className="text-base text-primary-red">
                    Error loading payment plans!
                  </p>
                )}
                <p className="my-1 text-4xl font-semibold">
                  {planObject
                    ? planObject?.currency
                    : dayDashPlanObject?.currency}{" "}
                  {planObject ? planObject?.amount : dayDashPlanObject?.amount}
                </p>
                {billingFrequency !== "hourly" && (
                  <p className="text-primary-black opacity-70">
                    {planObject && planObject.interval === "weekly"
                      ? "Per Week"
                      : "Per Month"}
                  </p>
                )}
              </div>
              {billingFrequency === "hourly" ? (
                <ul className="my-3 space-y-2 px-3">
                  {dayDashPlan?.map((feature, _i) => (
                    <li
                      className="flex space-x-5 text-center gap-2 text-sm"
                      key={_i}
                    >
                      <CheckCheck className="text-primary-blue w-4 h-4" />
                      {feature?.text}
                    </li>
                  ))}
                </ul>
              ) : (
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
              )}
              <div className="border-t border-t-light-grey" />
              <div className="p-5 flex items-center justify-center">
                <Button
                  className="bg-primary-black text-white text-sm"
                  disabled={isLoadingPaymentPlans}
                  onClick={() => {
                    handleFlutterPayment({
                      callback: async (response) => {
                        // console.log(response, "payment res");
                        //send this to appwrite to create a subscription
                        // console.log(response, "res test");
                        if (response) {
                          //if user subscription details for this user exists
                          if (userSubscriptionDetails?.id) {
                            // console.log('got in block A')
                            const updatedPaymentPayload = {
                              document_id: userSubscriptionDetails?.id,
                              is_subscribed:
                                response.status === "successful" ||
                                response.status === "completed"
                                  ? true
                                  : false,
                              currency: response?.currency!,
                              subscription_start_date: new Date().toISOString(),
                              tx_ref: response?.tx_ref!,
                              transaction_id: response?.transaction_id!,
                              amount: response?.amount!,
                              subscription_type:
                                billingFrequency === "hourly"
                                  ? "daydash"
                                  : "reoccuring",
                            };
                            const updatedSubscription = await updateSubcription(
                              updatedPaymentPayload
                            );
                            if (updatedSubscription) {
                              toast({
                                description:
                                  "Hey Champ! Your have successfully subsribed to the pro plan",
                                className: "bg-primary-blue text-white",
                              });
                              //handle redirection
                              navigate("/my-assistants");
                            }
                            if (!updatedSubscription) {
                              //we need to get the user payment details from flutterwave and resolve the issue if they successfully paid
                              toast({
                                title:
                                  "Unable to save Subcription details, please contact us, let's help you figure this out asap",
                                description:
                                  "Something went wrong, Don't panic, It will be resolved",
                                className: "bg-primary-red text-white",
                              });
                              navigate("/my-assistants");
                            }
                          } else {
                            // console.log('got in block B')
                            const paymentPayload = {
                              user_id: user?.id!,
                              is_subscribed:
                                response.status === "successful" ||
                                response.status === "completed"
                                  ? true
                                  : false,
                              amount: response?.amount!,
                              currency: response?.currency!,
                              subscription_start_date: new Date().toISOString(),
                              user_email: response?.customer?.email!
                                ? response?.customer?.email!
                                : user?.email!,
                              transaction_id: response?.transaction_id!,
                              tx_ref: response?.tx_ref!,
                              subscription_type:
                                billingFrequency === "hourly"
                                  ? "daydash"
                                  : "reoccuring",
                            };
                            //update subscription details with is susbcribed start date tex ref and transaction id
                            //else create a new susbcrption
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
                                className: "bg-primary-red text-white",
                              });
                              navigate("/my-assistants");
                            }
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
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EnterprisePlanModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          className={buttonVariants({
            size: "sm",
            className: "text-primary-blue underline rounded-md",
          })}
        >
          Try enterprise plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className={`relative rounded-2xl shadow-lg`}>
          <div className="p-1 text-center">
            <h3 className="my-1 text-center text-xl font-bold">Enterprise</h3>
            <p className="text-primary-black opacity-70 text-sm">
              For larger projects with a specific use case
            </p>
            <p className="my-1 text-4xl font-semibold">Custom</p>
            <p className="text-primary-black opacity-70">Per Month</p>
          </div>
          <ul className="my-3 space-y-2 px-3">
            {enterprisePlan?.map((feature, _i) => (
              <li className="flex space-x-5 text-center gap-2 text-sm" key={_i}>
                <CheckCheck className="text-primary-blue w-4 h-4" />
                {feature?.text}
              </li>
            ))}
          </ul>
          <div className="border-t border-t-light-grey" />
          <div className="p-5 flex items-center justify-center">
            <Button
              className="bg-primary-black text-white text-sm"
              onClick={() => navigate("/enterprise")}
            >
              Talk to us
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserAccount = () => {
  // User Information
  const { user, userSubscriptionDetails, checkAuthUser } = useUserContext();

  // console.log(userSubscriptionDetails,'user sub')

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <Container>
      <div className="mt-0 md:mt-2 flex flex-col gap-2 border-b border-gray-200 pb-1 px-3 md:px-2">
        <h1 className="font-bold mb-5 text-2xl md:text-4xl text-primary-black">
          Account Information
        </h1>
      </div>
      <div className="px-1 md:px-7 flex gap-5 flex-col md:flex-row mt-3 rounded-md shadow-xl">
        <div className="w-full mt-5 p-7">
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

            <div className="flex flex-col gap-1">
              <PaymentModal
                user={user}
                userSubscriptionDetails={userSubscriptionDetails}
              />
              <EnterprisePlanModal />
            </div>
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
                {userSubscriptionDetails?.is_subscribed &&
                  "Current subcription plan"}
              </p>
              <div className="text-sm text-primary-black opacity-80">
                {userSubscriptionDetails?.is_subscribed ? (
                  "Pro Plan"
                ) : (
                  <div className="text-base text-black">
                    You are currently on the
                    <span className="text-primary-blue font-medium">
                      {" "}
                      Free Plan
                    </span>
                  </div>
                )}
              </div>
            </div>
            {userSubscriptionDetails?.is_subscribed &&
              userSubscriptionDetails?.subscription_start_date && (
                <div className="flex flex-col">
                  {/* <Button className="bg-primary-red text-white text-base mt-2 text-center w-full md:w-[30%]">
                  Cancel Subscription
                </Button> */}
                  <p className="text-primary-blue font-medium text-sm">
                    Current Billing start date
                  </p>
                  <p className="text-base text-primary-black">
                    {formatDateString(
                      userSubscriptionDetails?.subscription_start_date
                    )}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserAccount;
