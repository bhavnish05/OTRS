import { useEffect, useState } from "react";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";
import { getTickets } from "@/components/api/dashboardApi";
import KPI from "@/components/kpi";
import { useAtomValue, useSetAtom } from "jotai";
import { ticketsAtom, } from "@/lib/atoms";

const Home = () => {
  const setTickets = useSetAtom(ticketsAtom);
  const tickets = useAtomValue(ticketsAtom);

  // const setUsername = useSetAtom(usernameAtom);
 


  async function handleTicketsFetch() {
    try {
      const response = await getTickets();
      console.log(response);
      // setUsername(response.data.username);
      setTickets(response.data.ticketId);

    } catch (error) {
      console.log(error);
    }
  }

  

  useEffect(() => {
    handleTicketsFetch();
  }, []);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      <KPI tickets={tickets} />
      <div className="px-4">
        <DataTable columns={columns} data={tickets} />
      </div>
    </div>
  );
};

export default Home;
