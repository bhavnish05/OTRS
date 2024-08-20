import { TicketDetails } from "@/lib/types";
import { BookText, Clock } from "lucide-react";

interface AuditTabProps {
  ticketDetails: TicketDetails;
}

const AuditTab: React.FC<AuditTabProps> = ({ ticketDetails }) => {
  return (
    <>
      <span className="flex gap-2 items-center">
        <BookText className="h-4 w-4 text-muted-foreground"/>
        <p className="text-xs font-bold text-muted-foreground">
          Audit
        </p>
        </span>
      <div className="mt-2">
        {ticketDetails?.eventLog.map((value, index) => (
          <div className="flex justify-between" key={index}>
            <div className="flex gap-2">
              <p className="text-muted-foreground">{index + 1}.</p>
              <p className="">{value.event_description}</p>
            </div>
            <p className="flex gap-2 items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3"/>
              {value.event_datetime}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AuditTab;
