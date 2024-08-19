import { TicketDetails } from "@/lib/types";
import { File, PencilLine, Plus, XCircle } from "lucide-react";
import { downloadDocument, submitResolution } from "./api/ticketsApi";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { uploadApi } from "./api/uploadApi";

interface ResolutionTabProps {
  ticketDetails: TicketDetails;
}

const ResolutionTab: React.FC<ResolutionTabProps> = ({ ticketDetails }) => {
  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDownloadDocument = async (file_name: string) => {
    try {
      const response = await downloadDocument(file_name);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (resolution === "" && file === null) {
      alert("Enter Resolution or File");
    } else {
      if (file) {
        try {
          const response = await uploadApi(file);
          setUploadedFiles([...uploadedFiles, response.data.new_filename]);
          setFile(null);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleSubmitResolution = async () => {
    try {
      const jsonString = JSON.stringify(uploadedFiles);
      const response = await submitResolution(
        jsonString,
        ticketDetails.ticket_id,
        "",
        resolution
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
              ticketDetails?.status === "closed"
            }
            type="button"
            onClick={handleUpload}
          >
            Upload
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
