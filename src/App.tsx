import { useEffect, lazy, Suspense } from "react";
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
import Skeleton from "react-loading-skeleton";

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
  const { pathname } = useLocation();
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <>
      <Suspense fallback={<Skeleton height={1100} className="my-2" count={1} />}>
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
