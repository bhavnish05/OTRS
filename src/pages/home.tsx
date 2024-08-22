import { useEffect, useState } from "react";

import { Tickets } from "@/lib/types";

import { columns } from "@/components/tickets/columns";
import { DataTable } from "@/components/tickets/data-table";
import { getTickets } from "@/components/api/dashboardApi";
import KPI from "@/components/kpi";

const Home = () => {
  const [tableData, setTableData] = useState<Tickets[]>([]);

  async function handleTicketsFetch() {
    try {
      const response = await getTickets();
      setTableData(response.data.ticketId);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleTicketsFetch();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <KPI tickets={tableData} />
      <div className="px-4">
        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  );
};

export default Home;
