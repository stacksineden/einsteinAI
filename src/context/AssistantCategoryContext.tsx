import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
  assistantCategory: "",
  setAssistantCategory: () => {},
};

type IAssistantCategoryType = {
  assistantCategory: string;
  setAssistantCategory: React.Dispatch<React.SetStateAction<string>>;
};

const AssistantCategoryContext =
  createContext<IAssistantCategoryType>(INITIAL_STATE);

export function AssistantCategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assistantCategory, setAssistantCategory] = useState("");

  const value = {
    assistantCategory,
    setAssistantCategory,
  };

  return (
    <AssistantCategoryContext.Provider value={value}>
      {children}
    </AssistantCategoryContext.Provider>
  );
}

export const useAssistantCategoryContext = () =>
  useContext(AssistantCategoryContext);
