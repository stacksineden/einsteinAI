import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount } from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // const { mutateAsync: signInAccount, isPending: isSigningIn } =
  //   useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidationSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newUser = await createUserAccount(values);
    if (newUser instanceof Error) {
      // Assuming err.message contains the API error message
      return toast.error(
        newUser?.message || "Sign up failed, please try again."
      );
    }

    if (newUser) {
      toast.success(
        "A verification email has been sent. Plese verify your account"
      );
    }
    // const session = await signInAccount({
    //   email: values.email,
    //   password: values.password,
    // });

    // if (!session) {
    //   return toast({
    //     title: "Sign in failed, please try again.",
    //   });
    // }
    setIsCheckingAuth(true);
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      setIsCheckingAuth(false);
      navigate("/app");
    } else {
      setIsCheckingAuth(false);
      navigate("/sign-in");
    }
  }

  return (
    <Form {...form}>
      <div className="w-[85%] md:w-[60%] flex-center flex-col">
        <Link to="/" className="w-[150px] md:w-[170px]">
          <img
            src="/assets/images/text-brand.png"
            alt="brand"
            className="w-full object-contain"
          />
        </Link>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-zinc-100">
          Create a new account
        </h2>
        <p className="text-zinc-400 font-light small-medium md:base-regular">
          To use EinsteinAI, Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isCreatingUser || isCheckingAuth}
          >
            {isCreatingUser || isCheckingAuth ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-zinc-100 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-blue text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
