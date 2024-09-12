import { useEffect, useState } from "react";
import { Tickets } from "@/lib/types";

import { getLoggedUsers } from "@/components/api/userApi";

interface KPIProps {
  tickets: Tickets[];
}

const KPI: React.FC<KPIProps> = ({ tickets }) => {
  const [loggedInUsersCount, setLoggedInUsersCount] = useState(0);

  async function handleFetchLoggedInUsers() {
    try {
      const response = await getLoggedUsers();
      const loggedInUsers = response.data.logged_in_users;
      setLoggedInUsersCount(loggedInUsers);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchLoggedInUsers();
  }, []);

  const pendingTicketsCount = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;
  const raisedTodayCount = tickets.filter(
    (ticket) =>
      new Date(ticket.raised_at).toDateString() === new Date().toDateString()
  ).length;

  const breachedCount = tickets.filter((ticket) => {
    const slaDue = new Date(ticket.sla_due);
    const slaStart = new Date(ticket.sla_start);
    const difference = slaStart.getTime() - slaDue.getTime();
    return difference < 0;
  }).length;

  const aboutToBreachCount = tickets.filter((ticket) => {
    const slaDue = new Date(ticket.sla_due);
    const slaStart = new Date(ticket.sla_start);
    const difference = (slaDue.getTime() - slaStart.getTime()) / (1000 * 60);
    return difference > 0 && difference <= 30;
  }).length;

  const kpis = [
    { label: "pending tickets", value: pendingTicketsCount },
    { label: "raised today", value: raisedTodayCount },
    { label: "breached", value: breachedCount },
    { label: "about to breach", value: aboutToBreachCount },
    {
      label: "not assigned",
      value: tickets.filter((ticket) => ticket.assignedToMe === false).length,
    },
    { label: "technicians available", value: loggedInUsersCount },
  ];

  return (
    <div className="p-4 flex gap-10 items-center flex-wrap">
      {kpis.map((kpi, index) => (
        <div
          className={`px-4 py-2 min-w-[180px] rounded-md border border-muted ${
            kpi.label === "technicians available" && "bg-green-600"
          } 
            ${kpi.label === "not assigned" && "bg-slate-500 "}
            ${kpi.label === "pending tickets" && "bg-yellow-500 "}
            ${kpi.label === "raised today" && "bg-blue-500 "}
            ${kpi.label === "breached" && "bg-red-600 "}
             ${
               kpi.label === "about to breach" && "bg-orange-500 animate-pulse"
             }`}
          key={index}
        >
          <span>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs capitalize">{kpi.label}</p>
          </span>
        </div>
      ))}
    </div>
  );
};

export default KPI;
