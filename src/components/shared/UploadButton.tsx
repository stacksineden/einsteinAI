import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "../ui/progress";
import { uploadFileToOpenAI } from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";
import { useSaveFileToDB } from "@/lib/tanstack-query/queriesAndMutation";

type UploadZoneProps = {
  setIsOpen: (value: boolean) => void;
};

const UploadDropZone = ({ setIsOpen }: UploadZoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { mutateAsync: saveFile } =
    useSaveFileToDB();

  const { user } = useUserContext();

  const { toast } = useToast();

  const determinateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = determinateProgress();
        //send request to open ai to upload file
        const res = await uploadFileToOpenAI(acceptedFile);
        //save the res to the db on behalf of the user.
  

        if (res) {
          toast({
            description: "Your File is successfully uploaded.",
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

        const fileObject = {
          userId: user?.id,
          fileId: res?.id,
          fileName: res?.filename,
          fileSize: res?.bytes,
          dateUploaded: res?.created_at,
        };

        const newFile = await saveFile(fileObject);

        if (!newFile) {
          return toast({
            title: "Unable to save file!",
            description: "Please try again",
            className: "bg-red-200 text-white",
          });
        }

        // try to delete file uploaded to open ai if saving failed.

        if (newFile) {
          toast({
            description: "Your File is successfully saved.",
            className: "bg-primary-blue text-white",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsOpen(false);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">File size up to 512 MB</p>
                <p className="text-xs text-zinc-500 mt-2">
                  <span className="font-medium">PDF, CSV, DOCX, MD, JSON</span>{" "} 
                  and various other file types are supported
                  <br />
                  Refer to the FAQs for a comprehensive list of supported files
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-primary-blue" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0]?.name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    indicatorColor="bg-primary-blue"
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}

              <input
                {...getInputProps()}
                className="hidden"
                // id="dropzone-file"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          className={buttonVariants({
            size: "lg",
            className: "bg-primary-black text-white rounded-md",
          })}
        >
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropZone setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
