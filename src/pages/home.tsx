import { useEffect} from "react";

import { columns } from "@/components/tickets-table/columns";
import { DataTable } from "@/components/tickets-table/data-table";
import { getCustomers, getTickets } from "@/components/api/dashboardApi";
import KPI from "@/components/kpi";
import { useAtomValue, useSetAtom } from "jotai";
import { customersAtom, ticketsAtom, usernameAtom } from "@/lib/atoms";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const setTickets = useSetAtom(ticketsAtom);
  const tickets = useAtomValue(ticketsAtom);

  const setUsername = useSetAtom(usernameAtom);

  const setCustomers = useSetAtom(customersAtom);

  async function handleCustomers(){
    try {
      const response = await getCustomers();
     
      
      setCustomers(response.data.customers);
    } catch (error) {
      toast({
        title: "Tickets",
        description: "Unable to fetch customers.",
        variant: "destructive",
      });

    }
  }

  async function handleTicketsFetch() {
    try {
      const response = await getTickets();
      console.log(response);
      
    
      setUsername(response.data.username);
      setTickets(response.data.ticketId);
    
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
    handleCustomers();
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
