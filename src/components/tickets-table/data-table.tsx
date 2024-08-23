import { useState } from "react";

import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ChevronDownIcon, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import CreateNewTicket from "../dialog/createNewTicket";
import FilterSheet from "../dialog/filter-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [searchField, setSearchField] = useState<string>("title");
  const [createNewTicketDialogState, setCreateNewTicketDialogState] =
    useState<boolean>(false);
  const [filterDialogState, setFilterDialogState] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex justify-between gap-4">
        <Input
          placeholder={`Filter ${searchField}`}
          value={
            (table.getColumn(searchField)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchField)?.setFilterValue(event.target.value)
          }
          className="max-w-sm capitalize"
        />

        <Select onValueChange={setSearchField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Fields" />
          </SelectTrigger>
          <SelectContent>
            {table.getAllColumns().map((column) => {
              return (
                <SelectItem key={column.id} value={column.id}>
                  {column.id}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          className="flex gap-2 items-center"
          variant="outline"
          onClick={() =>
            setCreateNewTicketDialogState(!createNewTicketDialogState)
          }
        >
          <p>Create </p>
          <PlusCircle className="h-4 w-4" />
        </Button>

        <Button onClick={() => setFilterDialogState(!filterDialogState)}>
          Filter
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border mt-4">
        <Table className="mt-4">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-xs">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-xs"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <CreateNewTicket
        dialogState={createNewTicketDialogState}
        setDialogState={() =>
          setCreateNewTicketDialogState(!createNewTicketDialogState)
        }
      />

      <FilterSheet
        dialogState={filterDialogState}
        setDialogState={() => setFilterDialogState(!filterDialogState)}
      />
    </>
  );
}
