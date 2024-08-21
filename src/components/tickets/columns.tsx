import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { Tickets } from "@/lib/types";
import { pickupTicket } from "../api/ticketsApi";

import { ArrowUpDown, ExternalLink} from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<Tickets>[] = [
  {
    accessorKey: "ticket_id",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticket ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      );
    },
    cell: (data) => {
      return (
        <Link
          to={`/idPage/${data.cell.getValue() as string}`}
          className="flex gap-1 items-center group"
        >
          <p>{data.cell.getValue() as string}</p>
          <ExternalLink className="h-3 w-3 hidden group-hover:block" />
        </Link>
      );
    },
  },
  {
    accessorKey: "customer_id",
    header: "Customer ID",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "raised_at",
    header: "Raised At",
  },
  {
    accessorKey: "sla_due",
    header: "SLA-Due",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "severity",
    header: "Severity",
  },
  {
    accessorKey: "bucket",
    header: "Bucket",
  },
  {
    accessorKey: "canPick",
    header: "",
    cell: (data) => {
      const ticketId = data.row.original.ticket_id;
      const canPick = data.row.original.canPick;

      return (
        <Button
          disabled={!canPick}
          onClick={async () => await pickupTicket(ticketId)}
        >
          {canPick ? "Pick" : "Picked"}
        </Button>
      );
    },
  },
];
