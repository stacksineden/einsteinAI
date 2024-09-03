import { useEffect, useState } from "react";
import { ISubscription, IUser } from "@/types";
import toast from "react-hot-toast";
import {
  useCreateUserSubscription,
  useGetFlutterwavePaymentPlans,
  useUpdateUserSubscriptionDetails,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useNavigate } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCheck, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findOnetimeSubcriptionAmount, proPlanFeatures } from "@/modelDataset";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/AppContext";

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

const BillingModal = ({ user, userSubscriptionDetails }: PaymentModalProps) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // Billing Information

  const { openPaymentModal, setOpenPaymentModal } = useAppContext();

  const [currency, setCurrency] = useState("USD");
  const [sub, setSub] = useState(false);

  const { mutateAsync: createSubscritpion } = useCreateUserSubscription();
  const { mutateAsync: updateSubcription } = useUpdateUserSubscriptionDetails();

  // console.log(user, "useruseruseruser");
  // console.log(userSubscriptionDetails, "userSubscriptionDetails");

  const oneTimeSubscription = findOnetimeSubcriptionAmount(currency);

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
    if (!sub) {
      const planDetails = {
        id: 67899,
        name: "One-time Payment",
        amount: oneTimeSubscription?.amount!,
        currency: oneTimeSubscription?.currency!,
      };
      setDayDashPlanObject(planDetails);
      setPlanObject(undefined); // Reset planObject when billingFrequency is "hourly"
      return;
    }

    const fetchData = async () => {
      if (!isLoadingPaymentPlans && !isError) {
        const planDetails = getPlan("monthly", currency);
        // console.log(planDetails,'details')
        setPlanObject(planDetails);
      }
    };

    fetchData();
  }, [currency, isLoadingPaymentPlans, isError, sub]);

  const navigate = useNavigate();

  // console.log(user, "user details");

  // Flutterwave configuration
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: planObject ? planObject?.amount! : dayDashPlanObject?.amount!,
    currency: planObject ? planObject?.currency! : dayDashPlanObject?.currency!,
    payment_options: sub ? "card, banktransfer, ussd" : "card",
    payment_plan: sub ? String(planObject?.id!) : undefined,
    customer: {
      email: user?.email!,
      phone_number: "",
      name: user?.name!,
    },
    customizations: {
      title: `Payment for pro ${
        planObject ? planObject?.interval : "One-time"
      } plan`,
      description: `Payment for pro ${
        planObject ? planObject?.interval : "One-time"
      } plan`,
      logo: "https://res.cloudinary.com/dyryfgjro/image/upload/v1710761978/rgia6ac2ctfrsol6rlld.jpg",
    },
  };

  // console.log(config, "config");

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Dialog
      open={openPaymentModal}
      onOpenChange={(visible) => {
        if (!visible) {
          setOpenPaymentModal(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setOpenPaymentModal(true)} asChild>
        <Button
          className={`${
            userSubscriptionDetails?.is_subscribed
              ? "bg-transparent"
              : "bg-zinc-700"
          } border border-zinc-700 rounded-full hover:opacity-90 flex gap-2 text-zinc-100 mt-1 w-full text-sm z-0 group relative items-center font-normal`}
        >
          {userSubscriptionDetails?.is_subscribed ? (
            <div className="h-[30px] w-[30px] flex items-center justify-center rounded-full mx-1">
              <img
                src={
                  user?.imageUrl || "/assets/images/assistants/placeholder.png"
                }
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : (
            <Sparkles className="text-zinc-100 mr-2" />
          )}
          {userSubscriptionDetails?.is_subscribed
            ? `${user?.name}`
            : "Upgrade to Pro"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="p-2">
          <div className="flex flex-col gap-2">
            {/* <div className="text-zinc-100 font-medium text-xl">EinsteinAI</div> */}
            <div className="w-[150px] my-2">
              <img
                src="/assets/images/text-brand.png"
                alt="brand"
                className="w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="text-base text-zinc-100">
              Email:{" "}
              <span className="text-zinc-400">{user?.email ?? "-- --"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Switch onCheckedChange={() => setSub(!sub)} checked={sub} />
              <p className="text-zinc-500 text-base">
                {sub
                  ? "Switch To One-Time Payment"
                  : "Switch To Subscription Mode"}
              </p>
            </div>
            <div className="flex gap-3 my-1 justify-end items-center">
              <Select
                value={currency}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger className="w-[100px] md:w-[200px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-100">
                  <SelectGroup onChange={(e) => console.log(e)}>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <h2 className="text-3xl text-zinc-100">Unlock Unlimited Access</h2>
          </div>
          <div className="my-2">
            <ul className="my-3 space-y-2 px-3">
              {proPlanFeatures?.map((feature, _i) => (
                <li
                  className="flex space-x-5 text-center gap-2 text-sm text-zinc-100"
                  key={_i}
                >
                  <CheckCheck className="text-primary-blue w-5 h-5" />
                  {feature?.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center items-center w-full pt-2">
            {userSubscriptionDetails?.is_subscribed ? (
              <div className="py-2 px-7 mx-auto text-zinc-400 rounded-lg border border-zinc-500 text-base font-medium">
                Current plan
              </div>
            ) : (
              <Button
                className="bg-primary-black text-white text-lg"
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
                            subscription_type: sub
                              ? "Subcription Plan"
                              : "One-Time Payment Plan",
                          };
                          const updatedSubscription = await updateSubcription(
                            updatedPaymentPayload
                          );
                          if (updatedSubscription) {
                            toast.success(
                              "Hey Champ! Your have successfully subsribed to the pro plan"
                            );
                            //handle redirection
                            navigate("/my-assistants");
                          }
                          if (!updatedSubscription) {
                            //we need to get the user payment details from flutterwave and resolve the issue if they successfully paid
                            toast.error(
                              "Unable to save Subcription details, please contact us, let's help you figure this out asap. Something went wrong, Don't panic, It will be resolved"
                            );
                            navigate("/app");
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
                            subscription_type: sub
                              ? "Subcription Plan"
                              : "One-Time Payment Plan",
                          };
                          //update subscription details with is susbcribed start date tex ref and transaction id
                          //else create a new susbcrption
                          const createSubscription = await createSubscritpion(
                            paymentPayload
                          );
                          if (createSubscription) {
                            toast.success(
                              "Hey Champ! Your have successfully subsribed to the pro plan"
                            );
                            //handle redirection
                            navigate("/my-assistants");
                          }
                          if (!createSubscription) {
                            //we need to get the user payment details from flutterwave and resolve the issue if they successfully paid
                            toast.error(
                              "Unable to save Subcription details, please contact us, let's help you figure this out asap. Something went wrong, Don't panic, It will be resolved"
                            );
                            navigate("/app");
                          }
                        }
                      }
                      if (!response) {
                        //definetely and issuw from flutterwave, we can still get their payment details and help them verify with flutterwave but definetly not on us
                        toast.error("Payment Unsuccessful");
                      }
                      closePaymentModal(); // this will close the modal programmatically
                    },
                    onClose: () => {},
                  });
                }}
              >
                {sub
                  ? `Upgrade for ${planObject?.currency ?? ""} ${
                      planObject?.amount ?? ""
                    }/Month`
                  : `One-time Upgrade for ${
                      oneTimeSubscription?.currency ?? ""
                    } ${oneTimeSubscription?.amount ?? ""}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingModal;
