import { useState, useRef, useEffect } from "react";
import { useLoadMessgaeOpenAI } from "@/lib/tanstack-query/queriesAndMutation";
import {
  getImageUrlByName,
  getMatchingPromptsForAssistants,
} from "@/modelDataset";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ChatIntro from "./ChatIntro";
import ReactMarkdown from "react-markdown";
import { Loader2, Clipboard, CheckCheck } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";

const Messages = ({
  threadId,
  assistantName,
  pretrainingName,
}: MessagesProps) => {
  const { data: messages, isPending: isLoadingMessges } =
    useLoadMessgaeOpenAI(threadId);

  const { user } = useUserContext();

  const [copied, setCopied] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // console.log(messages, "messages from react query");

  // .message-content {
  //   white-space: pre-line; /* Ensures formatting and line breaks are respected */
  //   padding: 0; /* Adjust or remove padding as needed */
  //   line-height: 1.2; /* Adjust this value as needed */
  // }

  const MessageBlock = ({ message }: MessageBlockProps) => {
    const role = message?.role;
    const contentValue = message?.content?.[0]?.text?.value || "";

    const isCodeSnippet = contentValue.startsWith("```");

    return (
      <div className={`py-5 text-primary-black overflow-x-scroll`}>
        <div className="px-5 md:px-10 max-w-2xl mx-auto flex flex-col gap-1">
          <div className="flex space-x-2 items-center">
            <img
              src={
                role === "user"
                  ? user?.imageUrl
                  : getImageUrlByName(pretrainingName)
              }
              alt="assistant_image"
              className="h-8 w-8 rounded-full bg-light-grey"
            />
            <p className="text-base text-primary-black font-semibold">
              {role === "user" ? "You" : assistantName}
            </p>
          </div>
          {/* pt-1 text-sm md:text-base text-primary-black tracking-wide */}
          {/* <p className="pt-1 text-sm md:text-base text-primary-black tracking-wide"> */}
          {/* <ReactMarkdown className="text-primary-black text-base">
            {contentValue}
          </ReactMarkdown> */}
          {isCodeSnippet ? (
            <SyntaxHighlighter language="javascript" style={a11yDark}>
              {contentValue}
            </SyntaxHighlighter>
          ) : (
            <ReactMarkdown className="text-primary-black text-base">
              {contentValue}
            </ReactMarkdown>
          )}
          {/* </p> */}
          {/* copy chat content */}
          {role !== "user" && !copied && (
            <div
              className="w-full flex justify-end items-center gap-1 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(contentValue!);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <Clipboard className="h-5 w-5 text-primary-black opacity-70" />
              <p className="text-xs text-primary-black">Copy</p>
            </div>
          )}
          {role !== "user" && copied && (
            <div className="w-full flex justify-end items-center gap-1 cursor-pointer">
              <CheckCheck className="h-5 w-5 text-primary-black opacity-70" />
              <p className="text-xs text-primary-black">Copied</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // console.log(messages, "messages from react query");

  return (
    <>
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        ref={messagesContainerRef}
      >
        {messages?.data &&
          messages?.data?.length > 0 &&
          messages.data
            .slice()
            .reverse()
            .map((message: MessageBlockProps["message"], index: number) => (
              <MessageBlock key={index} message={message} />
            ))}

        {isLoadingMessges && (
          <div className="flex items-center justify-center w-full h-full text-center flex-col gap-2">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <p className="text-primary-black text-base">
              {" "}
              Loading messages ....
            </p>
          </div>
        )}
      </div>
      {messages?.data?.length === 0 && !messages?.data && (
        <ChatIntro
          assistant_name={pretrainingName}
          user_assistant_name={assistantName}
          matching_prompts={getMatchingPromptsForAssistants(pretrainingName!)}
        />
      )}
      {messages?.data?.length === 0 && (
        <ChatIntro
          assistant_name={pretrainingName}
          user_assistant_name={assistantName}
          matching_prompts={getMatchingPromptsForAssistants(pretrainingName!)}
        />
      )}
    </>
  );
};

export default Messages;

type MessagesProps = {
  threadId: string;
  assistantName: string;
  pretrainingName: string;
};

type MessageBlockProps = {
  message: {
    role: string;
    content: {
      type: string;
      text: {
        value: string;
        annotations: any[];
      };
    }[];
  };
};





