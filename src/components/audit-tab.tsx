import { TicketDetails } from "@/lib/types";

import { BookText, Clock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface AuditTabProps {
  ticketDetails: TicketDetails;
}

const AuditTab: React.FC<AuditTabProps> = ({ ticketDetails }) => {
  return (
    <>
      <span className="flex gap-2 items-center">
        <BookText className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-bold text-muted-foreground">Audit</p>
      </span>
      <ScrollArea className="mt-4 p-3 w-full h-[300px] bg-background rounded-md">
        <div className="flex flex-col gap-2">
          {ticketDetails?.eventLog.map((value, index) => (
            <div className="flex gap-2 items-center" key={index}>
              <p className="text-xs text-muted-foreground w-[20px] text-right">{index + 1}.</p>
              <div className="flex justify-between border rounded-md p-2 w-full">
                <p className="text-xs">{value.event_description}</p>
                <p className="flex gap-2 items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {value.event_datetime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default AuditTab;
