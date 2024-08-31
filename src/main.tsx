import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { QueryProvider } from "./lib/tanstack-query/QueryProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";
import { MatchingPromptProvider } from "./context/MatchingPromptContext.tsx";
import { AssistantCategoryProvider } from "./context/AssistantCategoryContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryProvider>
        <AuthProvider>
          <ChatProvider>
            <MatchingPromptProvider>
              <AssistantCategoryProvider>
                <AppProvider>
                  <App />
                </AppProvider>
              </AssistantCategoryProvider>
            </MatchingPromptProvider>
          </ChatProvider>
        </AuthProvider>
      </QueryProvider>
    </React.StrictMode>
  </BrowserRouter>
);
