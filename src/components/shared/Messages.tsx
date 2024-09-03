import { useState, useRef, useEffect } from "react";
import { useLoadMessgaeOpenAI } from "@/lib/tanstack-query/queriesAndMutation";
import {
  getImageUrlByName,
  getMatchingPromptsForAssistants,
} from "@/modelDataset";
import Lottie from "lottie-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ChatIntro from "./ChatIntro";
import ReactMarkdown from "react-markdown";
import { Loader2, Clipboard, CheckCheck } from "lucide-react";
import EinsteinGptIntro from "./EinsteinGptIntro";
import { useChatContext } from "@/context/ChatContext";
import AnimatedMessage from "@/icons/message-ani.json";

const Messages = ({
  threadId,
  assistantName,
  pretrainingName,
}: MessagesProps) => {
  const { data: messages, isPending: isLoadingMessges } =
    useLoadMessgaeOpenAI(threadId);

  const { activityMessage, messageLoading } = useChatContext();

  const [copied, setCopied] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageBlock = ({ message }: MessageBlockProps) => {
    const role = message?.role;
    const contentValue = message?.content?.[0]?.text?.value || "";

    return (
      <div
        className={`py-3 text-primary-black overflow-x-scroll scrollbar-hide ${
          role === "user" && "flex justify-end"
        }`}
      >
        <div
          className={`px-2 md:px-5 max-w-4xl flex flex-col gap-2 ${
            role !== "user" && "mx-auto"
          }`}
        >
          {role !== "user" && (
            <div className="flex space-x-2 items-center">
              <img
                src={getImageUrlByName(pretrainingName)}
                alt="assistant_image"
                className="h-8 w-8 rounded-full bg-transparent"
              />
              <p className="text-base text-zinc-100 font-semibold">
                {assistantName}
              </p>
            </div>
          )}

          <ReactMarkdown
            children={contentValue}
            className={`text-zinc-300 text-sm tracking-wide ${
              role === "user" &&
              "bg-zinc-800 py-4 px-4 md:px-5 max-w-[300px] md:max-w-[550px] w-full rounded-3xl overflow-x-scroll"
            }`}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    // {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={a11yDark}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          />

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
              <Clipboard className="h-5 w-5 text-zinc-100 opacity-70" />
              <p className="text-xs text-zinc-100 ">Copy</p>
            </div>
          )}
          {role !== "user" && copied && (
            <div className="w-full flex justify-end items-center gap-1 cursor-pointer">
              <CheckCheck className="h-5 w-5 text-zinc-100  opacity-70" />
              <p className="text-xs text-zinc-100">Copied</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="overflow-y-auto overflow-x-hidden scrollbar-hide"
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
            <p className="text-zinc-100 text-sm md:text-base">
              {" "}
              Loading messages ....
            </p>
          </div>
        )}
        {/* save the string in each toast to an in message toast  */}
        {messageLoading && (
          <div className="py-2 h-9 max-w-4xl px-2 md:px-5 mx-auto text-zinc-400 flex items-center">
            <Lottie
              animationData={AnimatedMessage}
              loop={true}
              style={{
                height: "45px",
                width: "45px",
              }}
            />
            {activityMessage ? (
              <div className="text-zinc-300 md:text-base text-sm">
                {activityMessage}
              </div>
            ) : (
              <div className="text-zinc-300 md:text-base text-sm">
                Analyzing ...
              </div>
            )}
          </div>
        )}
      </div>
      {messages?.data?.length === 0 &&
        !messages?.data &&
        assistantName !== "EinsteinGPT" && (
          <ChatIntro
            assistant_name={pretrainingName}
            user_assistant_name={assistantName}
            matching_prompts={getMatchingPromptsForAssistants(pretrainingName!)}
          />
        )}
      {messages?.data?.length === 0 &&
        !messages?.data &&
        assistantName === "EinsteinGPT" && <EinsteinGptIntro />}
      {/* {messages?.data?.length === 0 && assistantName !== "EinsteinGPT" && (
        <ChatIntro
          assistant_name={pretrainingName}
          user_assistant_name={assistantName}
          matching_prompts={getMatchingPromptsForAssistants(pretrainingName!)}
        />
      )} */}
      {/* {messages?.data?.length === 0 && assistantName === "EinsteinGPT" && (
        <EinsteinGptIntro />
      )} */}
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
