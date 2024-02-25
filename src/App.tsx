import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import SignUpForm from "./_auth/forms/SignUpForm";
import SignInForm from "./_auth/forms/SignInForm";
import RootLayout from "./_root/RootLayout";
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
import Landing from "./_root/Landing";
import { AssistantChat } from "./__chat/chatpage";
import ChatLayout from "./__chat/ChatLayout";
import VerifyAccount from "./_auth/forms/VerifyAccount";
import ForgotPassword from "./_auth/forms/ForgotPassword";
import ResetPassword from "./_auth/forms/ResetPassword";
import Pricing from "./_root/Pricing";
import Enterprise from "./_root/Enterprise";

function App() {
  return (
    <>
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
        <Route path="/enterprise" element={<Enterprise />}/>
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
