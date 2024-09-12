import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { Tickets } from "@/lib/types";
import { pickupTicket } from "../api/ticketsApi";

import { ArrowUpDown, ExternalLink } from "lucide-react";
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
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
    cell: (data) => {
      return (
        <Link
          to={`/ticket/${data.cell.getValue() as string}`}
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
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer ID
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",

    cell: (data) => {
      return (
        <Link
          to={`/ticket/${data.row.original.ticket_id}`}
          className="flex gap-1 items-center group"
        >
          <p>{data.cell.getValue() as string}</p>
          <ExternalLink className="h-3 w-3 hidden group-hover:block" />
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: (data) => {
      return (
        <Link
          to={`/ticket/${data.row.original.ticket_id}`}
          className="flex gap-1 items-center group"
        >
          <p>{data.cell.getValue() as string}</p>
          <ExternalLink className="h-3 w-3 hidden group-hover:block" />
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (data) => {
      return (
        <Link
          to={`/ticket/${data.row.original.ticket_id}`}
          className="flex gap-1 items-center group"
        >
          <p>{data.cell.getValue() as string}</p>
          <ExternalLink className="h-3 w-3 hidden group-hover:block" />
        </Link>
      );
    },
  },
  {
    accessorKey: "breach_status",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breach Status
          <ArrowUpDown className="h-3 w-3" />
        </p>
      );
    },
    cell: (data) => {

      return (
        <p
          className={data.cell.getValue() as string === "breached" ? "text-red-500" : "text-green-500"}
        >
          {data.cell.getValue() as string}
        </p>
      );
    },
  },
  {
    accessorKey: "raised_at",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Raised At
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "sla_due",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SLA Due
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "severity",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Severity
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "bucket",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bucket
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
  },
  {
    accessorKey: "canPick",
    header: ({ column }) => {
      return (
        <p
          className="text-xs flex gap-2 items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </p>
      );
    },
    cell: (data) => {
      const ticketId = data.row.original.ticket_id;
      const canPick = data.row.original.canPick;
      const status = data.row.original.status;
      

      return (
  

          status === "closed" ? (
            <p>Ticket closed</p>

          ):(

            <Button
            disabled={!canPick}
            onClick={async () => {
              try {
                await pickupTicket(ticketId);
                window.location.href = window.origin + `/ticket/${ticketId}`;
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {canPick ? "Pick" : "Picked"}
          </Button>

          )
        
      );

          }
  },
];
