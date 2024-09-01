import { useMatchingPromptContext } from "@/context/MatchingPromptContext";
import { Brain, Code, GraduationCap, PenLine } from "lucide-react";

const EinsteinGptIntro = () => {
  const { setPromptMessage } = useMatchingPromptContext();
  return (
    <div className="text-primary-black overflow-y-auto flex-col items-center justify-center px-2 mt-5 py-20">
      <div className="flex flex-col items-center gap-2 mb-32">
        <div className="h-20 w-20 rounded-full shadow-md bg-transparent">
          <img
            src="/assets/images/brand.png" 
            alt="assistant-image"
            className="w-full object-contain rounded-full h-full"
          />
        </div>
        <h1 className="font-medium text-zinc-100 text-2xl">
          Einstein<span className="text-primary-blue">GPT</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 max-w-full md:max-w-[80%] mx-auto">
        <div
          className="px-4 py-3 rounded-xl border border-zinc-700 flex flex-col gap-2 cursor-pointer hover:bg-zinc-700"
          onClick={() =>
            setPromptMessage("Brainstorm Business Ideas on Marketing")
          }
        >
          <Brain className="text-primary-yellow h-5 w-5" />
          <p className="font-normal text-zinc-400 opacity-50 text-sm">
            Brainstorm Business Ideas on Marketing
          </p>
        </div>

        <div
          className="px-4 py-3 rounded-xl border border-zinc-700 flex flex-col gap-2 cursor-pointer hover:bg-zinc-700"
          onClick={() =>
            setPromptMessage("Explain the Concept of Quantum Physics")
          }
        >
          <GraduationCap className="text-primary-blue h-5 w-5" />
          <p className="font-normal text-zinc-400 opacity-50 text-sm">
            Explain the Concept of Quantum Physics
          </p>
        </div>

        <div
          className="px-4 py-3 rounded-xl border border-zinc-700 flex flex-col gap-2 cursor-pointer hover:bg-zinc-700"
          onClick={() => setPromptMessage("Write on Travel Vlogging Ideas")}
        >
          <PenLine className="text-primary-red h-5 w-5" />

          <p className="font-normal text-zinc-400 opacity-50 text-sm">
            Write on Travel Vlogging Ideas
          </p>
        </div>

        <div
          className="px-4 py-3 rounded-xl border border-zinc-700 flex flex-col gap-2 cursor-pointer hover:bg-zinc-700"
          onClick={() => setPromptMessage("Write code for an Axios request")}
        >
          <Code className="text-primary-blue h-4 w-4" />
          <p className="font-normal text-zinc-400 opacity-50 text-sm">
            Write code for an Axios request
          </p>
        </div>
      </div>
    </div>
  );
};

export default EinsteinGptIntro;
