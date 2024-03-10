import Container from "@/components/shared/Container";
import UploadButton from "@/components/shared/UploadButton";
import {
  useDeleteUserFiles,
  useGetUserFiles,
} from "@/lib/tanstack-query/queriesAndMutation";
import { Ghost, File, Plus, Trash, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteFileFromOpenAI } from "@/lib/openAI/api";
import { useUserContext } from "@/context/AuthContext";

import { Link } from "react-router-dom";

const Files = () => {
  const { toast } = useToast();

  const { user } = useUserContext();

  const [currentlyDeletedFile, setCurrentlyDeletedFile] = useState<
    string | null
  >(null);
  const {
    data: files,
    isPending: isFilesLoading,
    isError: isErrorFiles,
  } = useGetUserFiles(user?.id);

  const { mutateAsync: deleteFile, isPending: isDeletingFileLoading } =
    useDeleteUserFiles();

  const handleDeleteUserFile = async (fileId: string, openAIfileId: string) => {
    if (!fileId) return;
    setCurrentlyDeletedFile(fileId);
    try {
      const deletedFile = await deleteFile(fileId); 
      if (!deletedFile) {
        return toast({
          title: "Something went wrong!",
          description: "Unable to delete file",
          className: "bg-red-200 text-white",
        });
      }
      if (deletedFile) {
        await deleteFileFromOpenAI(openAIfileId);
        toast({
          description: "File successfully deleted.",
          className: "bg-primary-blue text-white",
        });
      }
    } catch (err) {}
  };

  return (
    <Container>
      <div className="mt-0 md:mt-2 flex justify-between gap-4 border-b border-gray-200 pb-5 items-center px-3 md:px-2">
        <h1 className="mb-3 font-bold text-2xl md:text-4xl text-primary-black">
          My Files
        </h1>
        <UploadButton />
      </div>
      {/* get all files */}
      {files?.documents && files?.documents?.length !== 0 ? (
        <ul className="mt-2 md:mt-8 grid grid-cols-1 gap-2 md:gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 px-3">
          {files?.documents
            .sort(
              (a, b) =>
                new Date(b.$createdAt).getTime() -
                new Date(a.$createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file?.$id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-2">
                    {/* <div className="h-7 w-7 flex-shrink-0 bg-gradient-to-r from-cyan-700 to-blue-700" /> */}
                    <File className="h-5 w-5" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm md:text-base font-medium text-primary-black">
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
                    {currentlyDeletedFile === file.$id ? (
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
        <Skeleton height={550} className="my-2" count={1} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
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
    </Container>
  );
};

export default Files;
