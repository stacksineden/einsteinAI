import { useState } from "react";
import UploadButton from "@/components/shared/UploadButton";
import {
  useDeleteUserFiles,
  useGetUserFiles,
  useGetUserVectorStoreDetails,
} from "@/lib/tanstack-query/queriesAndMutation";
import { Ghost, File, Plus, Trash, Loader2, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import { deleteFileFromOpenAI } from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Files = () => {
  const { user } = useUserContext();

  const [currentlyDeletedFile, setCurrentlyDeletedFile] = useState<
    string | null
  >(null);
  const {
    data: files,
    isPending: isFilesLoading,
    isError: isErrorFiles,
  } = useGetUserFiles(user?.id);

  const { data: vectorStore, isPending: isVectorStoreLoading } =
    useGetUserVectorStoreDetails(user?.id); 

  // console.log(files,'files')

  const { mutateAsync: deleteFile, isPending: isDeletingFileLoading } =
    useDeleteUserFiles();

  const handleDeleteUserFile = async (fileId: string, openAIfileId: string) => {
    if (!fileId) return;
    setCurrentlyDeletedFile(fileId);
    try {
      const deletedFile = await deleteFile(fileId);
      if (deletedFile instanceof Error) {
        // Assuming err.message contains the API error message
        return toast.error(
          deletedFile?.message || "Unable to delete file, please try again."
        );
      }
      if (deletedFile) {
        await deleteFileFromOpenAI(openAIfileId);
        toast.success("File successfully deleted.");
      }
    } catch (err) {}
  };

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col px-4 sm:px-8 pt-6">
        <div className="max-w-7xl self-center w-full">
          <div className="mt-0 md:mt-2 flex justify-end md:justify-between gap-4 border-b border-gray-700 pb-5 items-center px-3 md:px-4">
            <h1 className="mb-3 font-bold text-xl md:text-3xl text-zinc-100 hidden md:block">
              My Files
            </h1>
            <div className="flex items-center gap-3">
              {isVectorStoreLoading && (
                <div className="border border-primary-blue rounded-full py-2 px-5  flex items-center gap-1">
                  <Loader2 className="text-primary-blue h-4 w-4" />
                  <p className="text-zinc-400 text-xs font-medium">
                    Updating File Memory
                  </p>
                </div>
              )}
              {vectorStore?.documents &&
                vectorStore?.documents?.length !== 0 && (
                  <div className="border border-primary-blue rounded-full py-2 px-5  flex items-center gap-1">
                    <BadgeCheck className="text-primary-blue h-4 w-4" />
                    <p className="text-zinc-400 text-xs font-medium">
                      File Memory Updated
                    </p>
                  </div>
                )}
              <UploadButton
                files={files}
                vector_store_id={vectorStore?.documents[0]?.vector_store_id}
              />
            </div>
          </div>
          {/* get all files */}
          {files?.documents && files?.documents?.length !== 0 ? (
            <ul className="mt-4 md:mt-8 grid grid-cols-1 gap-2 md:gap-6 divide-y divide-zinc-800 md:grid-cols-2 lg:grid-cols-3 px-3">
              {files?.documents
                .sort(
                  (a, b) =>
                    new Date(b.$createdAt).getTime() -
                    new Date(a.$createdAt).getTime()
                )
                .map((file) => (
                  <li
                    key={file?.$id}
                    className="col-span-1 divide-y divide-zinc-700 rounded-lg bg-zinc-800 shadow transition hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="pt-6 px-6 flex w-full items-center justify-between space-x-2">
                        <File className="h-5 w-5 text-zinc-100" />
                        <div className="flex-1 truncate">
                          <div className="flex items-center space-x-3">
                            <h3 className="truncate text-sm md:text-sm font-medium text-zinc-100">
                              {file.fileName}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-1 mt-4 grid grid-cols-2 place-items-center py-1 md:py-2 gap-6 text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {format(new Date(file.$createdAt), "dd MMM yyyy")}
                      </div>

                      <Button
                        size="sm"
                        className="w-1/2 bg-red-100"
                        onClick={() =>
                          handleDeleteUserFile(file?.$id, file?.fileId)
                        }
                      >
                        {currentlyDeletedFile === file.$id &&
                        isDeletingFileLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : isFilesLoading ? (
            <Skeleton height={650} className="my-2 bg-zinc-600" count={1} />
          ) : (
            <div className="mt-16 flex flex-col items-center gap-2">
              <Ghost className="h-8 w-8 text-zinc-100" />
              <h3 className="font-semibold text-xl text-zinc-100">
                Pretty empty around here
              </h3>
              <p className="text-zinc-400">Let&apos;s upload your first PDF.</p>
            </div>
          )}
          {isErrorFiles && (
            <div className="mt-20 flex flex-col items-center gap-2 justify-center">
              <Ghost className="h-8 w-8 text-zinc-800" />
              <h3 className="font-semibold text-xl text-primary-red">
                Error getting Assistants
              </h3>
              <p>
                Please
                <Link to={"/app"} className="text-primary-blue">
                  navigate
                </Link>
                back to App, or relaod the page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
