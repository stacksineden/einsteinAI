import { useEffect, useState } from "react";
import { Loader2, Paperclip, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// import { useUserContext } from "@/context/AuthContext";
// import { useToast } from "../ui/use-toast";
import Dropzone from "react-dropzone";
import {
  cancelRunOpenAI,
  chatCompletionOpenAI,
  createMessageOpenAi,
  createRunOpenAI,
  generateImageOpenAI,
  retrieveRunOpenAI,
  submitToolsOutputOpenAI,
  uploadFileToOpenAI,
} from "@/lib/openAI/api";
import { useToast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/tanstack-query/queryKeys";
import {
  get_stock_info,
  get_weather,
  google_search,
} from "@/specialisedFunctions";
import { useMatchingPromptContext } from "@/context/MatchingPromptContext";
import { Textarea } from "../ui/textarea";

type UploadDropZoneProps = {
  setInMessageFiles: React.Dispatch<React.SetStateAction<string[]>>;
};

const UploadDropZone = ({ setInMessageFiles }: UploadDropZoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const res = await uploadFileToOpenAI(acceptedFile);
        if (res) {
          setInMessageFiles([res?.id]);
          toast({
            description: "File Saved! You can now send your message.",
            className: "bg-primary-blue text-white",
          });
        }
        if (!res) {
          return toast({
            title: "Something went wrong!",
            description: "Please try again",
            className: "bg-red-200 text-white",
          });
        }

        // set file ids to the res.id
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div className="flex items-center justify-center" {...getRootProps()}>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer"
          >
            <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow-lg gap-2">
              <div className="text-sm text-primary-black truncate md:block hidden">
                {acceptedFiles && acceptedFiles[0]
                  ? acceptedFiles[0]?.name
                  : "Attach File"}
              </div>
              <Paperclip className="h-6 w-6 text-primary-black" />
            </div>
            <input
              {...getInputProps()}
              className="hidden"
              // id="dropzone-file"
            />
          </label>
        </div>
      )}
    </Dropzone>
  );
};

const ChatInput = ({ assistantId, threadId }: ChatInputProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { promptMessage } = useMatchingPromptContext();

  //state for files that will be uploaded during chat
  const [inMessageFiles, setInMessageFiles] = useState<string[]>([]);
  const [message, setMessage] = useState(promptMessage || "");
  const [isRunning, setIsRunning] = useState(false);
  const [isRunId, setIsRunId] = useState("");

  // console.log(promptMessage, "promptmessage");

  useEffect(() => {
    setMessage(promptMessage || "");
  }, [promptMessage]);

  //we need to condtion to check for when there is fileIds else put in an empty array

  //define a function that checks run status
  const checkRunStatus = async (threadId: string, runId: string) => {
    let runResponseData = await retrieveRunOpenAI(threadId!, runId!);
    if (runResponseData?.status === "completed") {
      // Handle completed state
      // console.log("Run is completed.");
      toast({
        description: "Run is completed",
        className: "bg-primary-blue text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
      setIsRunning(false);
      //check on this do we have to invalidate quuries here again?
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
    } else if (runResponseData?.status === "requires_action") {
      // Handle requires_action state
      // console.log("Requires action");
      toast({
        description: "Run requires action",
        className: "bg-primary-blue text-white",
      });
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
              if (response) {
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: response,
                });
              }
            } catch (err) {
              toast({
                description:
                  "Content generation has failed, please cancel the run and try again.",
                className: "bg-primary-red text-white",
              });
              console.log(err);
            }
            //write functions for generating image urls
          } else if (functionName === "generate_image") {
            const { prompt } = args;
            if (!prompt) return;
            try {
              const response = await generateImageOpenAI(prompt);
              if (response) {
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: response,
                });
              }
            } catch (err) {
              toast({
                description:
                  "Image url generation has failed, please cancel the run and try again.",
                className: "bg-primary-red text-white",
              });
              console.log(err);
            }
          } else if (functionName === "google_search") {
            // write a function to get real time serach from google
            const { query } = args;
            if (!query) return;
            try {
              const response = await google_search(query);
              if (response) {
                // console.log(
                //   response,
                //   "response from serper api at client level"
                // );
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast({
                description:
                  "Google search query has failed, please cancel the run and try again.",
                className: "bg-primary-red text-white",
              });
              console.log(err);
            }
          } else if (functionName === "get_weather") {
            const { location } = args;
            if (!location) return;
            try {
              const response = await get_weather(location);
              if (response) {
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast({
                description:
                  "Getting weather details has failed, please cancel the run and try again.",
                className: "bg-primary-red text-white",
              });
              console.log(err);
            }
          } else if (functionName === "get_stock_info") {
            const { symbol } = args;
            if (!symbol) return;
            try {
              const response = await get_stock_info(symbol);
              if (response) {
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify(response),
                });
              }
            } catch (err) {
              toast({
                description:
                  "Getting stocks info has failed, please cancel the run and try again.",
                className: "bg-primary-red text-white",
              });
              console.log(err);
            }
          } else {
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
      // console.log("Thinking....");
      toast({
        description: "I'm thinking about this....",
        className: "bg-primary-blue text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
      setTimeout(() => {
        checkRunStatus(threadId, runId);
      }, 5000);
    }
    // Handle cancellations, failures, and expiration
    if (["cancelled", "failed", "expired"].includes(runResponseData.status)) {
      // Handle cancellation, failure, or expiration
      // console.log("Run is cancelled, failed, or expired.");
      toast({
        description: "Run has failed.",
        className: "bg-primary-red text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
      });
      setIsRunning(false);
    }
  };

  //create message to send to openAI
  const messageObject = {
    role: "user",
    content: message,
    file_ids: inMessageFiles,
  };

  const handleCreateOpenAiMessage = async () => {
    setIsRunning(true);
    if (!threadId) {
      toast({
        description: "Select or create a thread to start chat",
        className: "bg-primary-black text-white",
      });
    }
    if (!threadId && !messageObject?.content) {
      setIsRunning(false);
      return;
    }
    const res = await createMessageOpenAi(threadId!, messageObject);
    // console.log(res, "response meesgae from openAi");
    //we need to process run ==> get run Id from res
    if (!res) {
      toast({
        description:
          "Sending message failed, you can select or create a thread to start chat",
        className: "bg-primary-red text-white",
      });
      setIsRunning(false);
      throw new Error();
    }

    // try to invalidate the query here again
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES],
    });

    const runObject = {
      assistant_id: assistantId,
    };
    const runResponse = await createRunOpenAI(threadId!, runObject);
    // console.log(runResponse, "runResponserunResponserunResponse");

    if (!runResponse) {
      toast({
        description: "Run has failed",
        className: "bg-primary-red text-white",
      });
      setIsRunning(false);
      throw new Error();
    }
    //if run id is being return pass it to retrieve run
    if (runResponse) {
      //   // Clear the message input after successfully creating OpenAI message
      setMessage("");
      setIsRunning(true);
      const runId = runResponse?.id;
      setIsRunId(runId);
      checkRunStatus(threadId!, runId!);
    }
  };

  const handleCancelRun = async (threadId: string, runId: string) => {
    if (!threadId && !runId) return;
    const cancelRun = await cancelRunOpenAI(threadId!, runId!);
    if (cancelRun) {
      toast({
        description: "Run Cancelled Successfully",
        className: "bg-primary-blue text-white",
      });
      setIsRunning(false);
    }
    if (!cancelRun) {
      toast({
        description: "Run cancelling failed.",
        className: "bg-primary-red text-white",
      });
      setIsRunning(false);
    }
  };

  return (
    <div className="relative">
      <div className="mx-2 flex flex-col md:mx-2 lg:mx-auto lg:max-w-3xl xl:max-w-4xl">
        <div className="flex flex-col w-full p-4">
          {/* <Input
            className="h-12 border-2 border-light-grey shadow"
            placeholder="Enter your message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          /> */}
          <Textarea
            placeholder="Enter your message"
            className="h-12 border-2 border-light-grey shadow"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <div className="flex w-full items-center justify-start mt-2 gap-2 px-2">
            <Button
              className="bg-primary-black hover:opacity-90 flex gap-2 text-white"
              aria-label="send message"
              onClick={() => handleCreateOpenAiMessage()}
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
              Add and Run
            </Button>
            <Button
              className="bg-primary-red hover:opacity-90 flex gap-2 text-white"
              aria-label="send message"
              disabled={!isRunning}
              onClick={() => handleCancelRun(threadId!, isRunId!)}
            >
              Cancel Run
            </Button>
            {/* upload input */}
            {/* <UploadDropZone setInMessageFiles={setInMessageFiles}/>  */}
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
