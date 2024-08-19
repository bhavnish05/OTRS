import { TicketDetails } from "@/lib/types";

interface AuditTabProps {
  ticketDetails: TicketDetails;
}

const AuditTab: React.FC<AuditTabProps> = ({ ticketDetails }) => {
  return (
    <>
      <p className="text-xs font-bold text-muted-foreground">Audit</p>
      {ticketDetails?.eventLog.map((value, index) => (
        <div className="flex justify-between " key={index}>
          <div className="flex gap-2">
            <p className="text-muted-foreground">{index + 1}.</p>
            <p className="">{value.event_description}</p>
          </div>
          <p className="border border-muted px-2 py-1 rounded-md">{value.event_datetime}</p>
          <br />
        </div>
      ))}
    </>
  );
};

export default AuditTab;
