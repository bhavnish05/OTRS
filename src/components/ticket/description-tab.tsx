import React, { useState } from "react";
import { TicketDetails } from "@/lib/types";

import {FileDown, Pencil, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadDocument, updateDescription } from "../api/ticketsApi";
import { useToast } from "../ui/use-toast";

interface DescriptionTabProps {
  ticketDetails: TicketDetails;
  fetchTicketDetails: () => void;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({
  ticketDetails,
  fetchTicketDetails,
}) => {
  const { toast } = useToast();

  const [edit, setEdit] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    ticketDetails?.description
  );

  function handleCancelEdit() {
    setEdit(false);
    setDescription(ticketDetails?.description);
  }

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

  const handleUpdateDescription = async () => {
    try {
      const response = await updateDescription(
        ticketDetails.ticket_id,
        description
      );
      console.log(response);

      setEdit(false);
      fetchTicketDetails();
    } catch (error) {
      toast({
        title: "Ticket Description",
        description: "Failed to update ticket description",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* <BookOpenText className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-bold text-muted-foreground">Description</p> */}
        </div>

        {ticketDetails &&
          ticketDetails.file_paths.map((file, index) => (
            <TooltipProvider>
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span
                    className="cursor-pointer border border-muted pb-1 hover:bg-muted rounded-md "
                    onClick={() => handleDownloadDocument(file)}
                  >
                    <FileDown className="h-4 w-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{file}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
      <div className="mb-2 flex flex-col gap-2 items-end">
        {edit ? (
          <Textarea
            className="bg-background"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={
              ticketDetails?.username !== ticketDetails?.bucket && !edit
            }
          />
        ) : (
          <Textarea
            className="bg-background"
            value={ticketDetails?.description}
          />
        )}

        {edit && ticketDetails?.username === ticketDetails?.bucket && (
          <div className="flex gap-2">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="flex gap-3 items-center"
            >
              Cancel
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleUpdateDescription()}
              className="flex gap-3 items-center"
            >
              <p>Save</p>
              <Save className="h-4 w-4 " />
            </Button>
          </div>
        )}
        {!edit &&
          ticketDetails?.username === ticketDetails?.bucket &&
          ticketDetails?.status !== "closed" && (
            <Button
              onClick={() => setEdit(true)}
              className="flex gap-3 items-center"
              variant="outline"
            >
              <p>Edit</p>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
      </div>
    </>
  );
};

export default DescriptionTab;
