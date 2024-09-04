import { useEffect} from "react";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";
import { getTickets } from "@/components/api/dashboardApi";
import KPI from "@/components/kpi";
import { useAtomValue, useSetAtom } from "jotai";
import { customersAtom, ticketsAtom, usernameAtom } from "@/lib/atoms";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const setTickets = useSetAtom(ticketsAtom);
  const tickets = useAtomValue(ticketsAtom);

  const setUsername = useSetAtom(usernameAtom);

  const setCustomers = useSetAtom(customersAtom);

  async function handleTicketsFetch() {
    try {
      const response = await getTickets();
    
      setUsername(response.data.username);
      setTickets(response.data.ticketId);
      setCustomers(response.data.all_customers);
    } catch (error) {
      toast({
        title: "Tickets",
        description: "Unable to fetch Tickets.",
        variant: "destructive",
      });
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
