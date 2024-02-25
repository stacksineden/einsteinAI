import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
  promptMessage: "",
  setPromptMessage: () => {},
};

type IMatchingPromptsType = {
  promptMessage: string;
  setPromptMessage: React.Dispatch<React.SetStateAction<string>>;
};

const MatchingPromptContext =
  createContext<IMatchingPromptsType>(INITIAL_STATE);

export function MatchingPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [promptMessage, setPromptMessage] = useState("");

  const value = {
    promptMessage,
    setPromptMessage,
  };

  return (
    <MatchingPromptContext.Provider value={value}>
      {children}
    </MatchingPromptContext.Provider>
  );
}

export const useMatchingPromptContext = () => useContext(MatchingPromptContext);
