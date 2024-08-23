import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { getCustomerDetails } from "../api/userApi";
import { filterTickets } from "../api/ticketsApi";
import { useSetAtom } from "jotai";
import { ticketsAtom } from "@/lib/atoms";

const formSchema = z.object({
  sort_by: z.string(),
  sort_order: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  ticket_id: z.string(),
  customer_id: z.string(),
  customer_name: z.string(),
  type: z.string(),
  title: z.string(),
  bucket: z.string(),
  status: z.string(),
  severity: z.string(),
});

interface FilterSheetProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const FilterDialog: React.FC<FilterSheetProps> = ({
  dialogState,
  setDialogState,
}) => {
  const setTickets = useSetAtom(ticketsAtom);
  const [customers, setCustomers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bucket: "",
      customer_id: "",
      customer_name: "",
      end_date: new Date(),
      severity: "",
      sort_by: "ticket_id",
      sort_order: "asc",
      start_date: new Date(),
      status: "",
      ticket_id: "",
      title: "",
      type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const cleanedValues: { [key: string]: string | number | Date } =
        Object.fromEntries(
          Object.entries(values)
            .filter(
              ([key, value]) =>
                value !== "" && value !== null && value !== undefined
            )
            .map(([key, value]) => {
              if (key === "start_date" || key === "end_date") {
                return [key, format(new Date(value), "yyyy-MM-dd")];
              }
              if (key === "customer_id") {
                return [key, parseInt(value as string)];
              }
              return [key, value];
            })
        );
      const response = await filterTickets(cleanedValues);
      setTickets(response.data.tickets);
      setDialogState();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleFetchCustomers() {
    try {
      const response = await getCustomerDetails();
      setCustomers(response.data.customers);
    } catch (error) {
      //add toast
    }
  }

  useEffect(() => {
    handleFetchCustomers();
  }, []);

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent className="max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Apply filters</DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mt-4"
            >
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Created At</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="w-full">
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Facebook is hacked" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breach Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Hacked" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticket_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Id</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="420, 69" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="bucket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bucket</FormLabel>
                      <FormControl>
                        <Input placeholder="L1, L2...." {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Type</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SR">Service Request</SelectItem>
                          <SelectItem value="issue">Issue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Id</FormLabel>

                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Customer Id" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((user) => (
                            <SelectItem
                              key={user.customer_id}
                              value={user.customer_id.toString()}
                            >
                              {user.customer_id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((user) => (
                            <SelectItem
                              key={user.customer_id}
                              value={user.customer_name}
                            >
                              {user.customer_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>

                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="S1">S1</SelectItem>
                          <SelectItem value="S2">S2</SelectItem>
                          <SelectItem value="S3">S3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
