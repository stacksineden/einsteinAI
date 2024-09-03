import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "../ui/progress";
import {
  createVectorStoreFileBatchesOpenAI,
  createVectorStoreOpenAI,
  uploadFileToOpenAI,
} from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateUserVectorStores,
  useSaveFileToDB,
} from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";

type UploadZoneProps = {
  setIsOpen: (value: boolean) => void;
  files: Models.DocumentList<Models.Document> | undefined;
  vector_store_id: string;
};

const UploadDropZone = ({
  setIsOpen,
  files,
  vector_store_id,
}: UploadZoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { mutateAsync: saveFile } = useSaveFileToDB();
  const { mutateAsync: createVectorFile } = useCreateUserVectorStores();

  const { user } = useUserContext();

  const fileIDs = files?.documents?.map((file) => file?.fileId);

  // console.log(fileIDs, "fileIDsfileIDs");

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
          toast.success(
            "Your File is successfully uploaded. Updating memory, Please wait ..."
          );

          //if the user hasn't created vector stores before
          //call create vector calls

          if (vector_store_id) {
            const updatevectorStoreResponse =
              await createVectorStoreFileBatchesOpenAI(vector_store_id, [
                res?.id,
              ]);
            if (updatevectorStoreResponse) {
              toast.success("File Memory Updated.");
            }
            if (!updatevectorStoreResponse) {
              return toast.error("Error Updating File Memory.");
            }
          } else {
            const updatedFileIDs = [...(fileIDs ?? []), res?.id];

            const vectorStoreresponse = await createVectorStoreOpenAI(
              updatedFileIDs,
              `${user?.name}-vector-store`
            );
            // console.log(vectorStoreresponse);
            if (vectorStoreresponse) {
              //store in appwrite
              const payload = {
                user_id: user?.id,
                name: `${user?.name}-vector-store`,
                vector_store_id: vectorStoreresponse?.data?.vector_store_id,
              };
              // console.log(payload, "payloadpayload");
              await createVectorFile(payload);
              toast.success("File Memory Updated.");
              // console.log(saveVectoreStoreFilesToDB);
            }
            //if the user has created vector stores before call createVectorStoreFileBatchesOpenAI()
            if (!vectorStoreresponse) {
              return toast.error("Error Updating File Memory.");
            }
          }
          if (!res) {
            return toast.error("Something went wrong!");
          }
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
          return toast.error("Unable to save file!");
        }

        //if vector store has been created, retrive from the user object and for store id and pass file id to the vector store after every upload
        //else if it doesn't exists pass all the files of the user for batch updates after the first upload to create oe
        // try to delete file uploaded to open ai if saving failed.

        if (newFile) {
          toast.success("Your File is successfully saved.");
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
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <Cloud className="h-6 w-6 text-zinc-100 mb-2" />
                <p className="mb-2 text-sm text-zinc-100">
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

const UploadButton = ({ files, vector_store_id }: UploadButtonProps) => {
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
        <UploadDropZone
          setIsOpen={setIsOpen}
          files={files}
          vector_store_id={vector_store_id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;

type UploadButtonProps = {
  files: Models.DocumentList<Models.Document> | undefined;
  vector_store_id: string;
};
