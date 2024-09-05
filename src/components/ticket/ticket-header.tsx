import { TicketDetails } from "@/lib/types";
import Countdown from "../countdown";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const headerFields: string[] = [
  "customer_id",
  "raised_by_id",
  "breach_status",
  "type",
  "bucket",
  "severity",
];

interface TicketHeaderProps {
  ticketDetails: TicketDetails;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ ticketDetails }) => {
  const navigate = useNavigate();

  return (
    ticketDetails && (
      <div>
        <div id="ticket_title" className="flex gap-4 items-center top-0 sticky">
          <div className="rounded-full hover:bg-slate-400 px-2 py-2 ">
            <ArrowLeft
              className=" h-4 w-4 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>
          <span className="flex gap-2 font-bold text-3xl">
            <p>{ticketDetails.ticket_id}.</p>
            <p>{ticketDetails.title}</p>
          </span>
          <p
            className={`px-2 py-1 rounded-md text-[10px] ${
              ticketDetails.status == "open" ? "bg-green-600" : "bg-red-600"
            } `}
          >
            {ticketDetails.status}
          </p>
        </div>

        <div className="rounded-md border mt-4">
          <p className="px-4 py-2 bg-muted text-xs text-muted-foreground">
            Meta Details
          </p>
          <div className="p-4 flex gap-4">
            <div className="w-1/2 grid grid-cols-3 gap-3">
              {ticketDetails &&
                headerFields.map(
                  (field) =>
                    (ticketDetails as any)[field] !== undefined && (
                      <span className="" key={field}>
                        <p className="text-[9px] font-extrabold text-muted-foreground uppercase">
                          {field}
                        </p>
                        <p className="text-sm">
                          {(ticketDetails as any)[field]}
                        </p>
                      </span>
                    )
                )}
            </div>

            <div className="w-1/2 flex flex-col gap-2 items-center justify-center border-s">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground font-bold text-[10px]">
                  RAISED AT
                </p>
                <Countdown
                  targetDate={ticketDetails.raised_at}
                  countdown={false}
                />
              </div>

              <div className="flex flex-col items-center">
                <p className="text-muted-foreground font-bold text-[10px]">
                  SLA DUE
                </p>


                {ticketDetails.username!== ticketDetails.bucket?(
                  <p className="text-xl font-bold">00:00:00</p>
                ):(
                  <Countdown
                  targetDate={ticketDetails.sla_due}
                  countdown={new Date(ticketDetails.sla_due) > new Date()}
                />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TicketHeader;
