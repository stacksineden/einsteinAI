import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
  activeThreadId: "",
  setAciveThreadId: () => {},
  isGpt: false,
  setIsGpt: () => {},
  openGptModal: false,
  setOpenGptModal: () => {},
  messageLoading: false,
  setMessageLoading: () => {},
  activityMessage: "",
  setActivityMessage: () => {},
};

type IChatContextType = {
  activeThreadId: string;
  setAciveThreadId: React.Dispatch<React.SetStateAction<string>>;
  isGpt: boolean;
  setIsGpt: (isGpt: boolean) => void;
  openGptModal: boolean;
  setOpenGptModal: (openGptModal: boolean) => void;
  messageLoading: boolean;
  setMessageLoading: (messageLoading: boolean) => void;
  activityMessage: string;
  setActivityMessage: (activityMessage: string) => void;
};

const ChatContext = createContext<IChatContextType>(INITIAL_STATE);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeThreadId, setAciveThreadId] = useState("");
  const [isGpt, setIsGpt] = useState(INITIAL_STATE.isGpt);
  const [openGptModal, setOpenGptModal] = useState(INITIAL_STATE.openGptModal);
  const [messageLoading, setMessageLoading] = useState(
    INITIAL_STATE.messageLoading
  );
  const [activityMessage, setActivityMessage] = useState(
    INITIAL_STATE.activityMessage
  );
  const value = {
    activeThreadId,
    setAciveThreadId,
    isGpt,
    setIsGpt,
    openGptModal,
    setOpenGptModal,
    messageLoading,
    setMessageLoading,
    activityMessage,
    setActivityMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => useContext(ChatContext);
