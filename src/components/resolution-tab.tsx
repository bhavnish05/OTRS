import { TicketDetails } from "@/lib/types";
import { File, PencilLine, Plus, XCircle } from "lucide-react";
import { downloadDocument, submitResolution } from "./api/ticketsApi";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { uploadApi } from "./api/uploadApi";
import { useToast } from "./ui/use-toast";

interface ResolutionTabProps {
  ticketDetails: TicketDetails;
}

const ResolutionTab: React.FC<ResolutionTabProps> = ({ ticketDetails }) => {
  const { toast } = useToast();

  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const handleDownloadDocument = async (file_name: string) => {
    try {
      await downloadDocument(file_name);
    } catch (error) {
      toast({
        title: "Document Download",
        description: "Failed to download the document.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file === null) {
      toast({
        title: "Document Upload",
        description: "Please select a file before uploading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await uploadApi(file);
      startTransition(() => {
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          response.data.new_filename,
        ]);
        setFile(null);
        toast({
          title: "Document Upload",
          description: "Document uploaded successfully.",
          variant: "default",
        });
      });
    } catch (error) {
      toast({
        title: "Document Upload",
        description: "Failed to upload document.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitResolution = async () => {
    try {
      const jsonString = JSON.stringify(uploadedFiles);
      await submitResolution(
        jsonString,
        ticketDetails.ticket_id,
        "",
        resolution
      );
    } catch (error) {
      toast({
        title: "Resolution Submission",
        description: "Failed to submit resoltion.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRes = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, _index) => _index !== index));
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <PencilLine className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">Resolutions</p>
      </div>

      {ticketDetails?.resolutions.length !== 0 ? (
        ticketDetails?.resolutions.map((value, index) => (
          <div
            className="mt-2 flex justify-between gap-2 border border-muted rounded-md p-2 bg-background"
            key={index}
          >
            <div className="flex gap-2">
              <p className="text-muted-foreground">{index + 1}.</p>
              <p className="">{value.description}</p>
            </div>

            <div className="flex gap-1">
              {value.supporting_files.map((file, index) => (
                <span
                  key={index}
                  className="cursor-pointer border border-muted p-1 hover:bg-muted rounded-md"
                  onClick={() => handleDownloadDocument(file)}
                >
                  <File className="h-3 w-3" />
                </span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="py-2 text-muted-foreground">No Resolutions Found</p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">
          Add Resolutions
        </p>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <Input
          type="text"
          placeholder="Description"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {uploadedFiles.map((value, index) => (
            <div className="flex pr-1 mb-3" key={index}>
              <div className="relative group px-2 py-1 bg-primary rounded-md">
                <p className="text-xs">{value}</p>
                <XCircle
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 hidden group-hover:block cursor-pointer"
                  onClick={() => handleDeleteRes(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input id="file" type="file" onChange={handleFileChange} />
          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed" ||
              isPending
            }
            type="button"
            onClick={handleUpload}
          >
            {isPending ? "Uploading..." : "Upload"}
          </Button>

          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed"
            }
            type="button"
            onClick={handleSubmitResolution}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResolutionTab;
