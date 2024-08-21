import React, { useEffect, useState } from "react";
import {
  useReactTable,
  makeStateUpdater,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  flexRender,
  TableFeature,
  Table,
  RowData,
  OnChangeFn,
  ColumnDef,
  Column,
  Updater,
  functionalUpdate,
} from "@tanstack/react-table";

import { Tickets } from "@/lib/types";
import { getTickets } from "@/components/api/dashboardApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { pickupTicket } from "@/components/api/ticketsApi";

export type DensityState = "sm" | "md" | "lg";
export interface DensityTableState {
  density: DensityState;
}

export interface DensityOptions {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void;
  toggleDensity: (value?: DensityState) => void;
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
  //merge our new feature's state with the existing table state
  interface TableState extends DensityTableState { }
  //merge our new feature's options with the existing table options
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions { }
  //merge our new feature's instance APIs with the existing table instance APIs
  interface Table<TData extends RowData> extends DensityInstance { }
  // if you need to add cell instance APIs...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // if you need to add row instance APIs...
  // interface Row<TData extends RowData> extends DensityRow
  // if you need to add column instance APIs...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // if you need to add header instance APIs...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // Note: declaration merging on `ColumnDef` is not possible because it is a type, not an interface.
  // But you can still use declaration merging on `ColumnDef.meta`
}

// end of TS setup!

// Here is all of the actual javascript code for our new feature
export const DensityFeature: TableFeature<any> = {
  getInitialState: (state): DensityTableState => {
    return {
      density: "md",
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater("density", table),
    } as DensityOptions;
  },
  
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onDensityChange?.(safeUpdater);
    };
    table.toggleDensity = (value) => {
      table.setDensity((old) => {
        if (value) return value;
        return old === "lg" ? "md" : old === "md" ? "sm" : "lg"; //cycle through the 3 options
      });
    };
  },

 
};

function App(props: { filteredResults: any[] }) {
  const [pickupStatus, setPickupStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [data, _setData] = React.useState<Tickets[]>([]);
  const [density, setDensity] = React.useState<DensityState>("md");
  const [clicked, setClicked] = useState<{ [key: string]: boolean }>({});
  const [Pick, setPick] = useState(false);
  const navigate = useNavigate();
  console.log("Filtered Results App:", Array.isArray(props.filteredResults));
  console.log("Filtered Results in App:", props.filteredResults);

  useEffect(() => {
    _setData(props.filteredResults);
  }, [props.filteredResults]); 
console.log("filteredResults",data);

  const columns = React.useMemo<ColumnDef<Tickets>[]>(
    () => [
      {
        accessorKey: "ticket_id",
        header: "Ticket ID",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      // {
      //   accessorKey: "customer_id",
      //   header: "Customer ID",
      //   cell: (info) => info.getValue(),
      //   footer: (props) => props.column.id,
      // },
      {
        accessorKey: "customer_name",
        header: () => "Customer Name",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "type",
        header: () => <span>Type</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "raised_at",
        header: "Raised At",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "title",
        header: "Title",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sla_due",
        header: "SLA-Due",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "description",
        header: "Description",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "severity",
        header: "Severity",
        footer: (props) => props.column.id,
      },
      // {
      //   accessorKey: "priority",
      //   header: "Priority",
      //   footer: (props) => props.column.id,
      // },
      //   {
      //     accessorKey: "data",
      //     header: "Data",
      //     footer: (props) => props.column.id,
      //   },
      //   {
      //     accessorKey: "raised_by_id",
      //     header: "Raise By ",
      //     footer: (props) => props.column.id,
      //   },
      {
        accessorKey: "bucket",
        header: "Bucket",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "canPick",
        header: "Can Pick",
        cell: (info) => {
          const ticketId = info.row.original.ticket_id;
          const canPick = info.row.original.canPick; // assuming canPick is a boolean indicating whether the ticket can be picked up
          const isPicked = clicked[ticketId]; // checks if the ticket has already been picked

          return (
            <Button
              className={`p-2 ${canPick && !isPicked
                ? "bg-violet-600 hover:bg-yellow-400"
                : "bg-gray-400"
                } font-thin text-sm`}
              disabled={!canPick || isPicked} // disable button if cannot pick or already picked
              onClick={() => handlePickup(ticketId)}
            >
              {isPicked ? "Picked" : "Pick up"}
            </Button>
          );
        },
        footer: (props) => props.column.id,
      },
      //   {
      //     accessorKey: "canAssign",
      //     header: "Can Assign",
      //     footer: (props) => props.column.id,
      //   },
      //   {
      //     accessorKey: "assignedToMe",
      //     header: "Assigne to me",
      //     footer: (props) => props.column.id,
      //   },
    ],
    [pickupStatus]
  );

  const table = useReactTable({
    _features: [DensityFeature], //pass our custom feature to the table to be instantiated upon creation
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      density, //passing the density state to the table, TS is still happy :)
    },
    onDensityChange: setDensity, //using the new onDensityChange option, TS is still happy :)
  });

  const handlePickup = async (id: number) => {

    try {
      const response = await pickupTicket(id);

      setPickupStatus((prev) => ({ ...prev, [id]: response.data.msg }));
      setClicked((prev) => ({ ...prev, [id]: true }));
      setPick(false);
    } catch (error) {
      console.log(error);
      
    }
  };

  async function handleTicketsFetch() {
    try {
      const response = await getTickets();

      _setData(response.data.ticketId);
      console.log(data);

      console.log("datadatadata", response.data.ticketId);

      response.data.ticketId.map((value, index) => {

        setPick(value.canPick);
      });
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    handleTicketsFetch();
  }, []);

  return (
    
    <div className="p-2">
      {/* <button
        onClick={() => table.toggleDensity()}
        className="border rounded p-1 bg-blue-500 text-white mb-2 w-64"
      >
        Toggle Density
      </button> */}
      <div className="overflow-x-auto">
        <div className="block min-w-[1700px]">
          <table className="w-full">
            <thead className="border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className="font-normal border"
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          textAlign: "center",
                          padding:
                            density === "sm"
                              ? "4px"
                              : density === "md"
                                ? "3px"
                                : "7px",
                          transition: "padding 0.2s",
                        }}
                      >
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>

                        {header.column.getCanFilter() ? (
                          <div className="mt-1">
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr className=" hover:bg-violet-600 whitespace-nowrap" key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          style={{
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "normal",
                            padding:
                              density === "sm"
                                ? "4px"
                                : density === "md"
                                  ? "4px"
                                  : "8px",
                            transition: "padding 0.2s",
                          }}
                          onClick={() => {
                            cell.column.id === "ticket_id" &&
                              navigate(`/idPage/${cell.getValue()}`);
                          }}
                          className="border cursor-pointer"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        {/* <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span> */}
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
      {/* <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
    
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className=" font-light rounded-lg px-1 w-16 border border-mute ring-0 bg-transparent"
    />
  );
}

export default App;
