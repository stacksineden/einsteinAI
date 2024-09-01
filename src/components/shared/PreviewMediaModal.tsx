import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Eye } from "lucide-react";

const PreviewMediaModal = ({ file }: { file: any }) => {
  const [openMediaModal, setOpenMediatModal] = useState(false);

  const renderFilePreview = () => {
    if (!file) return null;

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      return (
        <div className="h-[400px] w-full">
          <img
            src={fileUrl}
            alt={file.name}
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <iframe src={fileUrl} title={file.name} className="h-[400px] w-full" />
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <Dialog
      open={openMediaModal}
      onOpenChange={(visible) => {
        if (!visible) {
          setOpenMediatModal(visible);
        }
      }}
    >
      <DialogTrigger onClick={() => setOpenMediatModal(true)} asChild>
        <Eye className="h-6 w-6 text-zinc-300" />
      </DialogTrigger>
      <DialogContent>
        <div className="p-2">{renderFilePreview()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewMediaModal;
