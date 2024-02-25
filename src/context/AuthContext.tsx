import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { ISubscription, IUser } from "@/types";
import { getCurrentUser, getUserSubcriptionStatus } from "@/lib/appwrite/api";

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
      if (currentAccount) {
        const userSubscriptionDetails = await getUserSubcriptionStatus(
          currentAccount?.currentUser.$id
        );
        if (userSubscriptionDetails) {
          const response = userSubscriptionDetails?.documents[0];
          setUserSubscriptionDetails({
            is_subscribed: response?.is_subscribed,
            subscription_start_date: response?.subscription_start_date,
            amount: response?.amount,
          });
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
