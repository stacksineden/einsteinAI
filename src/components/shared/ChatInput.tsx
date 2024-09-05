import { useEffect, useState } from "react";
import { Loader2, Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
// import Dropzone from "react-dropzone";
import {
  cancelRunOpenAI,
  chatCompletionOpenAI,
  createAssistantThreadOpenAI,
  createMessageOpenAi,
  createRunOpenAI,
  generateImageOpenAI,
  retrieveRunOpenAI,
  retrieveVectorStore,
  submitToolsOutputOpenAI,
  updateAssistantOpenAI,
  uploadFileToOpenAI,
  // uploadFileToOpenAI,
} from "@/lib/openAI/api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/tanstack-query/queryKeys";
import {
  get_stock_info,
  get_weather,
  // google_search,
  google_search_apify,
  scrape_web_url,
  trip_advisor_search,
  youtube_q_and_a,
  youtube_scrapper,
} from "@/specialisedFunctions";
import { useMatchingPromptContext } from "@/context/MatchingPromptContext";
import { Textarea } from "../ui/textarea";
import { getRandomStringFromArray, assistantAlertText } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetUserVectorStoreDetails,
  useSaveThreadToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useChatContext } from "@/context/ChatContext";
import { useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
import { ICreateMessage, ToolType, messageType } from "@/types";
import PreviewMediaModal from "./PreviewMediaModal";
import { Input } from "../ui/input";

type UploadDropZoneProps = {
  setInMessageFiles: React.Dispatch<React.SetStateAction<string[]>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
};

const UploadDropZone = ({
  setInMessageFiles,
  setImageUrl,
}: UploadDropZoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const res = await uploadFileToOpenAI(acceptedFile);
        if (res) {
          if (res?.purpose === "vision") {
            setImageUrl(res?.id);
          } else {
            setInMessageFiles([res?.id]);
          }
          setIsUploading(false);
          toast.success(
            "File Saved! You can now send your message.You can also preview your file"
          );
        }
        if (!res) {
          setIsUploading(false);
          return toast.error("File Processing Failed. Please try again");
        }

        // set file ids to the res.id
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <>
          <div className="flex items-center justify-center" {...getRootProps()}>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer"
            >
              <div className="flex items-center justify-center py-2 px-2 bg-zinc-700 rounded-lg shadow-lg gap-1">
                {/* <div className="text-sm text-primary-black truncate md:block hidden">
                {acceptedFiles && acceptedFiles[0]
                  ? acceptedFiles[0]?.name
                  : "Attach File"}
              </div> */}
                {isUploading ? (
                  <Loader2 className="h-4 w-4 md:h-6 md:w-6 text-blue-500 animate-spin" />
                ) : (
                  <Paperclip className="h-6 w-6 text-zinc-300" />
                )}
              </div>
              <input
                {...getInputProps()}
                className="hidden"
                // id="dropzone-file"
              />
            </label>
          </div>
          {acceptedFiles && acceptedFiles[0] && (
            <div className="flex items-center justify-center py-2 px-2 bg-zinc-700 rounded-lg shadow-lg gap-1 cursor-pointer">
              <PreviewMediaModal file={acceptedFiles[0]} />
            </div>
          )}
        </>
      )}
    </Dropzone>
  );
};

const ChatInput = ({ assistantId, vector_store_ids }: ChatInputProps) => {
  const { id } = useParams();
  const [, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { promptMessage } = useMatchingPromptContext();
  const {
    setActivityMessage,
    setMessageLoading,
    activeThreadId,
    setAciveThreadId,
  } = useChatContext();

  const { mutateAsync: saveThread } = useSaveThreadToDB();

  const { user } = useUserContext();

  const { data: vectorStore } = useGetUserVectorStoreDetails(user?.id);

  //state for files that will be uploaded during chat
  const [inMessageFiles, setInMessageFiles] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [message, setMessage] = useState(promptMessage || "");
  const [isRunning, setIsRunning] = useState(false);
  const [isRunId, setIsRunId] = useState("");
  const [, setIsCreatingThread] = useState(false);

  useEffect(() => {
    setMessage(promptMessage || "");
    setActivityMessage("");
  }, [promptMessage]);

  //we need to condtion to check for when there is fileIds else put in an empty array

  //check for vector store status before sending a message

  //define a function that checks run status
  const checkRunStatus = async (threadId: string, runId: string) => {
    let runResponseData = await retrieveRunOpenAI(threadId!, runId!);

    // Handle cancellations, failures, and expiration
    if (["cancelled", "failed", "expired"].includes(runResponseData.status)) {
      // Handle cancellation, failure, or expiration
      // console.log("Run is cancelled, failed, or expired.");
      toast.error("Message delivery failed. Please Try again");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
      setIsRunning(false);
      setMessageLoading(false);
      return;
    }

    if (runResponseData?.status === "completed") {
      // Handle completed state
      // console.log("Run is completed.");
      // toast({
      //   description: "We are good to go!",
      //   className: "bg-primary-blue text-white",
      // });
      // setActivityMessage("We are good to go!");
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
      setImageUrl("");
      setInMessageFiles([]);
      setIsRunning(false);
      setMessageLoading(false);
      //check on this do we have to invalidate quuries here again?
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
    } else if (runResponseData?.status === "requires_action") {
      // Handle requires_action state
      // console.log("Requires action");
      // toast({
      //   description: "I need to perform some supplementary actions",
      //   className: "bg-primary-blue text-white",
      // });
      setActivityMessage("I need to perform some supplementary actions");
      const toolCalls =
        runResponseData?.required_action?.submit_tool_outputs?.tool_calls;
      const toolOutputs: any[] = [];
      if (toolCalls) {
        for (const toolCall of toolCalls) {
          const functionName = toolCall?.function?.name;
          // console.log(
          //   `This question requires us to call a function: ${functionName}`
          // );
          const args = JSON.parse(toolCall?.function?.arguments);
          //handle generate content function calling
          if (functionName === "generate_content_for_a_given_prompt") {
            const { prompt } = args;
            if (!prompt) return; //you should show a toast message
            try {
              const response = await chatCompletionOpenAI(prompt);
              setActivityMessage("Generating content using GPT-4o-mini...");
              if (response) {
                setActivityMessage("Content generation has been completed.");
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: response,
                });
              }
            } catch (err) {
              toast.error(
                "Content generation has failed, please cancel the message and try again."
              );
              console.log(err);
            }
            //write functions for generating image urls
          } else if (functionName === "generate_image") {
            const { prompt } = args;
            if (!prompt) return;
            try {
              const response = await generateImageOpenAI(prompt);
              setActivityMessage("Generating image via DALL.E-3 ...");
              if (response) {
                setActivityMessage("Image Generation has been completed.");
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: response,
                });
              }
            } catch (err) {
              toast.error(
                "Image url generation has failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "google_search") {
            // write a function to get real time serach from google i replaced serper with apify ...i am to test this
            const { query } = args;
            if (!query) return;
            try {
              const response = await google_search_apify(query);
              setActivityMessage("Performing a Google search...");
              if (response) {
                setActivityMessage(
                  "Google search results have been generated."
                );

                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Google search query has failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "get_weather") {
            const { location } = args;
            if (!location) return;
            try {
              const response = await get_weather(location);
              setActivityMessage("Gathering weather results...");
              if (response) {
                setActivityMessage("Weather results have been generated.");
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting weather details has failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "get_stock_info") {
            const { symbol } = args;
            if (!symbol) return;
            try {
              const response = await get_stock_info(symbol);
              setActivityMessage("Gathering Stocks Information...");
              if (response) {
                setActivityMessage("Stocks information found.");
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting stocks info has failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "youtube_q_and_a") {
            const { url, message } = args;
            if (!url) return;
            try {
              const response = await youtube_q_and_a(url, message);
              setActivityMessage("Scraping YouTube to gather data...");
              if (response) {
                setActivityMessage("YouTube content available for Q and A.");
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting info about YouTube video, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "scrape_web_url") {
            const { url } = args;
            if (!url) return;
            try {
              const response = await scrape_web_url(url);
              setActivityMessage(
                "Analyzing and scraping the URL to gather data..."
              );
              if (response) {
                setActivityMessage(
                  "Content has been generated and is available."
                );
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting content failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "trip_advisor_search") {
            const { location } = args;
            if (!location) return;
            try {
              setActivityMessage(
                "Searching for trip advisor information based on the location..."
              );
              const response = await trip_advisor_search(location);
              if (response) {
                setActivityMessage(
                  "Trip advisor information has been generated and is available."
                );
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting content failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else if (functionName === "youtube_scrapper") {
            const { keyword } = args;
            if (!keyword) return;
            try {
              setActivityMessage(
                "Scraping YouTube for data based on the keyword..."
              );
              const response = await youtube_scrapper(keyword);
              if (response) {
                setActivityMessage(
                  "YouTube data has been generated and is available."
                );
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast.error(
                "Getting content failed, please cancel the message and try again."
              );
              console.log(err);
            }
          } else {
            //adjust other functions
            console.error(`Function "${functionName}" not found in the map.`);
          }
        }
        if (toolOutputs?.length === 0) return;
        const submitToolsOutput = await submitToolsOutputOpenAI(
          threadId!,
          runId!,
          toolOutputs
        );
        if (submitToolsOutput) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
          });
          checkRunStatus(threadId, runId);
        }
      }
    } else {
      // Handle other states or wait for completion

      // save the string in each toast to an in message toast

      // toast({
      //   description:
      //     getRandomStringFromArray(assistantAlertText) ||
      //     "Figuring this out ...",
      //   className: "bg-primary-blue text-white",
      // });
      setActivityMessage(
        getRandomStringFromArray(assistantAlertText) || "Figuring this out ..."
      );
      // queryClient.invalidateQueries({
      //   queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      // });
      setTimeout(() => {
        checkRunStatus(threadId, runId);
      }, 5000);
    }
  };

  const tools: ToolType[] = [
    { type: "file_search" },

    { type: "code_interpreter" },
  ];

  // Create the base message object
  const messageObject: ICreateMessage = {
    role: "user",
    content: [
      {
        type: "text",
        text: message,
      },
      ...(imageUrl
        ? ([
            {
              type: "image_file",
              image_file: {
                file_id: imageUrl,
              },
            },
          ] as { type: "image_file"; image_file: { file_id: string } }[])
        : []),
    ] as messageType,
    attachments:
      inMessageFiles.length > 0
        ? [
            {
              file_id: inMessageFiles[0],
              tools: tools,
            },
          ]
        : undefined,
  };

  async function retrieveStoreDetails(vector_store_id: string) {
    const response = await retrieveVectorStore(vector_store_id);
    // console.log(response, "resss");
    if (response) {
      setActivityMessage("Memory Updated");
      return response;
    }
    if (!response) {
      toast.error("File Memory Update Failed");
    }
  }

  const handleThreadCreation = async (description: string) => {
    let threadTitle = await chatCompletionOpenAI(
      `Your task is to generate a relevant and concise title for each chat thread based on the user's first message which is ${description}. Analyze the content to understand the main topic, theme, or question, and then suggest a title that accurately represents the subject of the conversation. The title should be clear, specific, and no longer than 5-7 words.`
    );
    threadTitle = threadTitle?.replace(/"/g, "");

    // console.log(threadTitle);
    const res = await createAssistantThreadOpenAI(threadTitle ?? description);
    if (res) {
      toast.success("Your Thread is successfully created.");
      //save to database
      const threadObject = {
        description: res?.metadata?.description,
        thread_id: res?.id,
        assistant_id: id!,
      };

      const newThread = await saveThread(threadObject);
      if (newThread) {
        toast.success("Your Thread is successfully saved.");
        setIsCreatingThread(false);
        setIsOpen(false);
        setAciveThreadId(threadObject?.thread_id!);
        return threadObject?.thread_id;
      }
      if (!newThread) {
        setIsCreatingThread(false);
        return toast.error("Unable to create thread!");
      }
    }
    if (!res) {
      setIsCreatingThread(false);
      return toast.error("Something went wrong!");
    }
  };

  const handleStartMessage = async () => {
    setIsRunning(true);
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
    });
    if (activeThreadId) {
      handleCreateOpenAiMessage(activeThreadId);
    } else {
      const textContent =
        messageObject?.content?.find(
          (item): item is { type: "text"; text: string } => item.type === "text"
        )?.text || "";

      const threadId = await handleThreadCreation(textContent ?? "");
      if (threadId) {
        handleCreateOpenAiMessage(threadId);
      }
    }
  };

  const handleCreateOpenAiMessage = async (threadId: string) => {
    // create a thread before anything
    setMessage("");
    setMessageLoading(true);

    if (!threadId) {
      toast.error("Please select or create a thread to start the chat.");
    }
    if (!threadId && !messageObject?.content) {
      setIsRunning(false);
      setMessageLoading(false);
      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
    });

    const res = await createMessageOpenAi(threadId!, messageObject);
    //we need to process run ==> get run Id from res
    if (!res) {
      toast.error("Please select or create a thread to start the chat.");
      setIsRunning(false);
      setMessageLoading(false);
      throw new Error();
    }

    // try to invalidate the query here again
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
    });
    setMessage("Analyzing ...");

    //if veector id is present and the assistant object tools resources is empty update assistant
    if (
      vectorStore?.documents[0]?.vector_store_id &&
      vector_store_ids?.length === 0
    ) {
      const assistantObjectTobeUpdated = {
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore?.documents[0]?.vector_store_id],
          },
          code_interpreter: {
            file_ids: [],
          },
        },
      };
      setMessage("Optimizing memeory for your files ...");
      const responseFromOpenAI = await updateAssistantOpenAI(
        id!,
        assistantObjectTobeUpdated
      );
      console.log(responseFromOpenAI);
      if (responseFromOpenAI) {
        setMessage("File Memory Updated ...");
      }
      if (!responseFromOpenAI) {
        console.log("here is a dead end");
      }
    }

    // check for file memory and getting it completed before proceeding
    // Polling mechanism for vector store status
    if (vectorStore?.documents[0]?.vector_store_id) {
      const vectorStoreId = vectorStore.documents[0]?.vector_store_id;
      let isCompleted = false;

      while (!isCompleted) {
        const response = await retrieveStoreDetails(vectorStoreId);

        if (response?.data?.status === "completed") {
          isCompleted = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
        }
      }
    }

    const runObject = {
      assistant_id: assistantId,
    };
    const runResponse = await createRunOpenAI(threadId!, runObject);
    if (!runResponse) {
      toast.error("Message processing has failed");
      setIsRunning(false);
      setMessageLoading(false);
      throw new Error();
    }
    //if run id is being return pass it to retrieve run
    if (runResponse) {
      //   // Clear the message input after successfully creating OpenAI message
      setActivityMessage("");
      setMessage("");
      setIsRunning(true);
      setMessageLoading(true);
      const runId = runResponse?.id;
      setIsRunId(runId);
      checkRunStatus(threadId!, runId!);
    }
  };

  const handleCancelRun = async (threadId: string, runId: string) => {
    if (!threadId && !runId) return;
    const cancelRun = await cancelRunOpenAI(threadId!, runId!);
    if (cancelRun) {
      toast.success("Run Cancelled Successfully");
      setIsRunning(false);
      setMessageLoading(false);
    }
    if (!cancelRun) {
      toast.error("Run cancelling failed.");
      setIsRunning(false);
      setMessageLoading(false);
    }
  };

  return (
    <div className="relative mb-2 md:mb-0">
      <div className="mx-2 flex flex-col md:mx-2 lg:mx-auto lg:max-w-3xl xl:max-w-4xl">
        <div className="flex flex-col w-full p-4">
          <Input
            className="h-12 border-2 border-light-grey shadow md:hidden block"
            placeholder="Enter your message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Textarea
            placeholder="Enter your message"
            className="h-12 border-2 border-light-grey shadow md:block hidden"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <div className="flex w-full items-center justify-start mt-2 gap-2 px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="bg-primary-black hover:opacity-90 flex gap-2 text-white"
                    aria-label="send message"
                    onClick={() => handleStartMessage()}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                    Send
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium text-black">
                    {/* {!threadId && "Create a thread to start the chat"} */}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              className="bg-primary-red hover:opacity-90 flex gap-2 text-white"
              aria-label="send message"
              disabled={!isRunning}
              onClick={() => handleCancelRun(activeThreadId!, isRunId!)}
            >
              Cancel
            </Button>
            {/* upload input */}
            <UploadDropZone
              setInMessageFiles={setInMessageFiles}
              setImageUrl={setImageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

type ChatInputProps = {
  assistantId: string;
  threadId?: string;
  // assistantObject:IAssistant
  vector_store_ids: string[];
};

// type ToolCall = {
//   function: {
//     name: string;
//     arguments: string;
//   };
//   id: string;
// };

// type RunResponseData = {
//   status: string;
//   required_action?: {
//     submit_tool_outputs?: {
//       tool_calls?: ToolCall[];
//     };
//   };
// };
