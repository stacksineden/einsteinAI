import { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import {
  AssistantTraining,
  Assistants,
  Files,
  Home,
  UpdateAssistant,
  UserAccount,
} from "./_root/pages";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

import NotFound from "./_root/NotFound";
import { Loader2 } from "lucide-react";

const AuthLayout = lazy(() => import("./_auth/AuthLayout"));
const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const SignInForm = lazy(() => import("./_auth/forms/SignInForm"));
const RootLayout = lazy(() => import("./_root/RootLayout"));
const Landing = lazy(() => import("./_root/Landing"));
const AssistantChat = lazy(() =>
  import("./__chat/chatpage").then((module) => ({
    default: module.AssistantChat,
  }))
);
const ChatLayout = lazy(() => import("./__chat/ChatLayout"));
const VerifyAccount = lazy(() => import("./_auth/forms/VerifyAccount"));
const ForgotPassword = lazy(() => import("./_auth/forms/ForgotPassword"));
const ResetPassword = lazy(() => import("./_auth/forms/ResetPassword"));
const Pricing = lazy(() => import("./_root/Pricing"));
const Enterprise = lazy(() => import("./_root/Enterprise"));
const UseCases = lazy(() => import("./_root/UseCases"));
const HelpCenter = lazy(() => import("./_root/HelpCenter"));

function App() {
  const [showFirstMessage, setShowFirstMessage] = useState(true);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstMessage(!showFirstMessage);
    }, 5000); // Change interval (in milliseconds) as needed
    return () => clearTimeout(timer);
  }, [showFirstMessage]);

  return (
    <>
      <Suspense
        fallback={
          <div className="w-[90%] mx-auto h-screen flex items-center justify-center flex-col gap-2">
            <Loader2 className="h-10 md:h-20 w-10 md:w-20 text-blue-500 animate-spin" />
            <div className="text-center">
              {showFirstMessage ? (
                <p className="text-base md:text-lg text-primary-black">
                  Hang tight! Our servers are doing some heavy lifting.
                </p>
              ) : (
                <p className="text-base md:text-lg text-primary-black">
                  In the meantime, why not practice your Jedi mind tricks? Try
                  to move the loading spinner with your mind... Almost there...
                </p>
              )}
            </div>
          </div>
        }
      >
        <Routes>
          {/* auth */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/verify-user" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<RootLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/files" element={<Files />} />
            <Route
              path="/pretrained-assistant/:id"
              element={<AssistantTraining />}
            />
            <Route
              path="/edit-assistant/:id/:docid"
              element={<UpdateAssistant />}
            />
            <Route path="/my-assistants" element={<Assistants />} />
            <Route path="/account" element={<UserAccount />} />
          </Route>
          <Route element={<ChatLayout />}>
            <Route path="/chat-assistant/:id" element={<AssistantChat />} />
          </Route>
          <Route index element={<Landing />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="use_cases" element={<UseCases />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
