import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { ISubscription, IUser } from "@/types";
import {
  getCurrentUser,
  getUserSubcriptionStatus,
  updateUserSubscriptionDetails,
} from "@/lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  imageUrl: "",
};

export const INITIAL_USER_SUBSCRIPTION_DETAILS = {
  is_subscribed: false,
  subscription_start_date: "",
  amount: 0,
  id: "",
  subscription_type: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  isEmailVerified: false as boolean,
  setIsEmailVerified: () => {},
  userSubscriptionDetails: INITIAL_USER_SUBSCRIPTION_DETAILS,
  setUserSubscriptionDetails: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  isEmailVerified: boolean;
  setIsEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
  userSubscriptionDetails: ISubscription;
  setUserSubscriptionDetails: React.Dispatch<
    React.SetStateAction<ISubscription>
  >;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(
    INITIAL_STATE.isEmailVerified
  );
  const [userSubscriptionDetails, setUserSubscriptionDetails] =
    useState<ISubscription>(INITIAL_USER_SUBSCRIPTION_DETAILS);

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();
      if (!currentAccount) {
        console.log("user not found");
      }
      if (currentAccount) {
        const userSubscriptionDetails = await getUserSubcriptionStatus(
          currentAccount?.currentUser.$id
        );

        //some where aound here ...we will check for the start data for if it is more than an hour..so we ca update the db for false

        if (userSubscriptionDetails) {
          const response = userSubscriptionDetails?.documents[0];
          //if the response start date is more than a day and the response.subscription_type === daydash
          //update the db with the payload
          const startDate = new Date(response?.subscription_start_date);
          const currentDate = new Date();
          const timeDifference = currentDate.getTime() - startDate.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);

          if (daysDifference > 1 && response?.subscription_type === "daydash") {
            const payload = {
              document_id: response?.$id,
              is_subscribed: false,
              subscription_start_date: response?.subscription_start_date,
              amount: response?.amount,
              subscription_type: response?.subscription_type,
              currency: response?.currency,
              tx_ref: response?.tx_ref,
              transaction_id: response?.transaction_id,
            };
            const updateUserSubscription = await updateUserSubscriptionDetails(
              payload
            );
            if (updateUserSubscription) {
              // console.log("user susbcription details updated");
              setUserSubscriptionDetails({
                is_subscribed: false,
                subscription_start_date: response?.subscription_start_date,
                amount: response?.amount,
                id: response?.$id,
                subscription_type: response?.subscription_type,
              });
            }
          } else {
            setUserSubscriptionDetails({
              is_subscribed: response?.is_subscribed,
              subscription_start_date: response?.subscription_start_date,
              amount: response?.amount,
              id: response?.$id,
              subscription_type: response?.subscription_type,
            });
          }
        }
        if (!userSubscriptionDetails) {
          setUserSubscriptionDetails(INITIAL_USER_SUBSCRIPTION_DETAILS);
        }
        setUser({
          id: currentAccount?.currentUser?.$id,
          name: currentAccount?.currentUser?.name,
          email: currentAccount?.currentUser?.email,
          imageUrl: currentAccount?.currentUser?.imageUrl,
        });
        setIsAuthenticated(true);
        setIsEmailVerified(currentAccount?.currentAccount?.emailVerification);
        return true;
      }
      // Exclude specified pages from redirection
      const excludedPaths = [
        "/",
        "/reset-password",
        "/sign-up",
        "/sign-in",
        "/pricing",
        "/use_cases",
        "/help-center",
        "/enterprise",
      ];
      if (!currentAccount && !excludedPaths.includes(location.pathname)) {
        navigate("/sign-in");
      }
      return false;
    } catch (err) {
      navigate("/sign-in");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");

    if (
      !(
        location.pathname.includes("/reset-password") ||
        location.pathname.includes("/sign-up") ||
        location.pathname.includes("/sign-in") ||
        location.pathname.includes("/pricing") ||
        location.pathname.includes("/use_cases") ||
        location.pathname.includes("/help-center") ||
        location.pathname.includes("/enterprise") ||
        location.pathname === "/"
      ) &&
      (cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined)
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    isEmailVerified,
    setIsEmailVerified,
    userSubscriptionDetails,
    setUserSubscriptionDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
