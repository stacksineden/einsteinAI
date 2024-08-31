import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
  assistantCategory: "",
  setAssistantCategory: () => {},
  selectedAvatar: "",
  setSelectedAvatar: () => {},
};

type IAssistantCategoryType = {
  assistantCategory: string;
  setAssistantCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedAvatar: string;
  setSelectedAvatar: React.Dispatch<React.SetStateAction<string>>;
};

const AssistantCategoryContext =
  createContext<IAssistantCategoryType>(INITIAL_STATE);

export function AssistantCategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assistantCategory, setAssistantCategory] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const value = {
    assistantCategory,
    setAssistantCategory,
    selectedAvatar,
    setSelectedAvatar,
  };

  return (
    <AssistantCategoryContext.Provider value={value}>
      {children}
    </AssistantCategoryContext.Provider>
  );
}

export const useAssistantCategoryContext = () =>
  useContext(AssistantCategoryContext);
