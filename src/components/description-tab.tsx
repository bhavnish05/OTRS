import React, { useState } from "react";
import { TicketDetails } from "@/lib/types";

import { BookOpenText, Pencil, Save, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface DescriptionTabProps {
  ticketDetails: TicketDetails;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ ticketDetails }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    ticketDetails?.description
  );

  function handleCancelEdit() {
    setEdit(false);
    setDescription(ticketDetails?.description);
  }

  async function handleUpdateDescription() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <BookOpenText className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">Description</p>
      </div>
      <div className="mt-4 flex flex-col gap-2 items-end">
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
              onClick={handleUpdateDescription}
              className="flex gap-3 items-center"
            >
              <p>Save</p>
              <Save className="h-4 w-4 " />
            </Button>
          </div>
        )}
        {!edit && ticketDetails?.username === ticketDetails?.bucket && (
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
