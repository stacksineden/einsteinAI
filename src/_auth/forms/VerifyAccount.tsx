import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateUserVerification } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const handleUserVerification = async () => {
    try {
      const response = await updateUserVerification(userId!, secret!); 
      if (response) {
        console.log("Account has been verified");
        toast({
          description: "Your Account has been successfully verified",
          className: "bg-primary-blue text-white",
        });
        navigate("/app");
      } else {
        return toast({
          title: "Verification failed, please try again",
          className: "bg-red-200 text-white",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sm:w-420 flex-center flex-col">
      <div className="font-bold text-3xl text-primary-blue">EinsteinAI</div>
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Account Verification.
      </h2>
      <p className="text-primary-black font-light small-medium md:base-regular">
        Welcome back, Please click the button below to verify your account.
      </p>
      <Button
        type="submit"
        className="shad-button_primary mt-3"
        onClick={() => handleUserVerification()}
      >
        Verify Account
      </Button>
    </div>
  );
};

export default VerifyAccount;
