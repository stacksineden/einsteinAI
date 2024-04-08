import Categories from "./Categories";
import Container from "./Container";
import Logo from "./Logo";
import { useLocation, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();

  const isAppPage = location.pathname.includes("/app");

  const { isEmailVerified, userSubscriptionDetails } = useUserContext();

  const navigate = useNavigate();

  return (
    <div className="fixed w-full bg-white shadow-sm z-10">
      <div className="py-2 md:py-4 px-3 border-b-[1px]">
        <Container>
          <div className="flex justify-between flex-row items-center gap-3 md:gap-0">
            <Logo />
            {!isEmailVerified && (
              <div className="bg-light-grey p-2 w-full md:w-1/2 fixed top-14 left-0 md:left-[20%] text-center text-sm rounded-md">
                <span className="underline text-primary-blue font-medium tracking-wide">
                  {" "}
                  Verification Email Sent!
                </span>{" "}
                Please check your inbox to verify your email
              </div>
            )}
            {!userSubscriptionDetails?.is_subscribed && (
              <div className="bg-white border border-light-grey shadow p-2 w-full md:w-1/2 fixed top-14 left-0 md:left-[20%] text-center text-sm rounded-md">
                Access{" "}
                <span className="font-medium text-primary-blue uppercase">
                  {" "}
                  Maestros
                </span>{" "}
                and{" "}
                <span className="text-primary-red font-medium uppercase">
                  Whiz
                </span>
                -level assistants with our{" "}
                <span
                  className="underline font-semibold cursor-pointer"
                  onClick={() => navigate("/account")}
                >
                  Pro Plan
                </span>
                . Only
                <span className="text-black font-medium uppercase">
                  {" "}
                  Rookie
                </span>
                -level assistants are available on the Free Plan.
              </div>
            )}
            <UserMenu />
          </div>
        </Container>
      </div>
      {/* Render Categories component only if on the app page */}
      {isAppPage && <Categories />}
    </div>
  );
};

export default Navbar;
