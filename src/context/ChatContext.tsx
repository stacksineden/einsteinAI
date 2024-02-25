import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
    activeThreadId:"",
    setAciveThreadId: () => {}
};

type IChatContextType = {
    activeThreadId: string;
    setAciveThreadId:React.Dispatch<React.SetStateAction<string>>
};

const ChatContext = createContext<IChatContextType>(INITIAL_STATE);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeThreadId, setAciveThreadId] = useState("");

  const value = {
    activeThreadId,
    setAciveThreadId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => useContext(ChatContext);
