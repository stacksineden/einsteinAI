import { useMatchingPromptContext } from "@/context/MatchingPromptContext";
import { MatchingPromptObject, getImageUrlByName } from "@/modelDataset";


const ChatIntro = ({
  assistant_name,
  matching_prompts,
  user_assistant_name,
}: ChatIntroProps) => {
  const { setPromptMessage } = useMatchingPromptContext(); 
  return (
    <div className="text-primary-black overflow-y-auto flex-col items-center justify-center px-2">
      <div className="flex flex-col items-center gap-2 mb-32">
        <div className="h-20 w-20 rounded-full shadow-md bg-light-grey">
          <img
            src={
              getImageUrlByName(assistant_name) ||
              "/assets/images/assistants/placeholder.png"
            }
            alt="assistant-image"
            className="w-full object-contain rounded-full h-full"
          />
        </div>
        <h1 className="font-medium text-primary-blue text-2xl">
          {user_assistant_name ? (
            user_assistant_name
          ) : (
            <div className=" bg-light-grey h-6 w-[300px] rounded-md animate-pulse"></div>
          )}
        </h1>
        <p className="text-2xl font-medium text-primary-black tracking-wide">
          How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-full md:max-w-[80%] mx-auto">
        {matching_prompts &&
          matching_prompts?.map((prompt, _i) => (
            <div
              className="px-4 py-3 rounded-xl border border-light-grey flex flex-col cursor-pointer hover:bg-light-grey"
              key={_i}
              onClick={() => setPromptMessage(prompt?.prompt!)}
            >
              <h2 className="text-sm text-primary-black font-medium truncate">
                {prompt?.head}
              </h2>
              <p className="font-normal text-primary-black opacity-50 text-sm">
                {prompt?.text}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatIntro;

type ChatIntroProps = {
  assistant_name: string;
  matching_prompts?: MatchingPromptObject[];
  user_assistant_name?: string;
};
