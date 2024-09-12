import { useState, useTransition } from "react";

import { TicketDetails } from "@/lib/types";
import {
  downloadDocument,
  submitResolution,
  uploadDocument,
} from "../api/ticketsApi";

import { Check, Clock, FileDown, Plus, Upload, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

interface ResolutionTabProps {
  ticketDetails: TicketDetails;
  fetchTicketDetails: () => void;
}

const ResolutionTab: React.FC<ResolutionTabProps> = ({
  ticketDetails,
  fetchTicketDetails,
}) => {
  const { toast } = useToast();

  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const handleDownloadDocument = async (document_name: string) => {
    try {
      const response = await downloadDocument(document_name);
      if (response.status === 200 && response.data instanceof ArrayBuffer) {
        const arrayBuffer = response.data;
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = document_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Unexpected response status or data format");
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the file.",
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
      const response = await uploadDocument(file);

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
    // const jsonString = uploadedFiles);

    if (resolution.trim() === "") {
      toast({
        title: "Resolution Submission",
        description: "Description cannot be empty",
        variant: "destructive",
      });
      return;
    }
    try {
      await submitResolution(
        uploadedFiles,
        ticketDetails.ticket_id,
        "",
        resolution
      );

      fetchTicketDetails();
      setUploadedFiles([]);
      setResolution("");

      toast({
        title: "Resolution Submission",
        description: "Your resolution has been submitted successfully.",
        variant: "default",
      });
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
        {/* <PencilLine className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">Resolutions</p> */}
      </div>

      <ScrollArea className="w-full mb-2 p-3 h-[300px] border border-muted rounded-md bg-background">
        <div className="flex flex-col gap-2">
          {ticketDetails?.resolutions.length !== 0 ? (
            ticketDetails?.resolutions.map((value, index) => (
              <div key={index} className="flex gap-2 items-center">
                <p className="text-muted-foreground text-xs text-right w-[20px]">
                  {index + 1}.
                </p>

                <div
                  className="flex justify-between gap-2 border p-2 rounded-md w-full"
                  key={index}
                >
                  <p className="text-xs">{value.description}</p>

                  <div className="flex gap-6">
                    <p className=" flex items-center text-xs text-muted-foreground">
                      {value.resolved_by}
                    </p>
                    <p className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {value.insert_date}
                    </p>

                    {value.supporting_files.length>0 && value.supporting_files[0] ==="" ? (
                      <p className="text-xs text-muted-foreground">no file present</p>
                    ):(

                      <TooltipProvider>
                      {value.supporting_files.map((file, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <span
                              className="cursor-pointer border border-muted p-1 hover:bg-muted rounded-md"
                              onClick={() => handleDownloadDocument(file)}
                            >
                              <FileDown className=" h-3 w-3" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{file.split("_")[1]}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                    )}
                 
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex w-full h-full justify-center items-center">
              <p className="font-bold text-muted-foreground mt-32">
                No Resolutions Found
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-2 mt-2">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">
          Add Resolutions
        </p>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <Textarea
          className="bg-background"
          placeholder="Description"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div className="flex pr-1 mb-3" key={index}>
              <div className="relative group px-2 py-1 bg-primary rounded-md">
                <p className="text-xs">{file.split("_")[1]}</p>
                <XCircle
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 hidden group-hover:block cursor-pointer"
                  onClick={() => handleDeleteRes(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-2">
          <Input id="file" type="file" onChange={handleFileChange} />
          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed" ||
              isPending
            }
            type="button"
            onClick={handleUpload}
            variant="outline"
            className="flex gap-3 items-center"
          >
            <p>{isPending ? "Uploading..." : "Upload"}</p>
            <Upload className="h-4 w-4" />
          </Button>

          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed"
            }
            type="button"
            onClick={handleSubmitResolution}
            className="flex gap-3 items-center"
          >
            <p>Submit</p>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResolutionTab;
