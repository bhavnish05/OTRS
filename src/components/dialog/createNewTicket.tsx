import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { XCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { createTicket, uploadDocument } from "../api/ticketsApi";
import { useAtomValue } from "jotai";
import { customersAtom} from "@/lib/atoms";


interface CreateNewTicketProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const formSchema = z.object({
  ticketType: z.string().min(2).max(50),
  severity: z.string(),
  customer_name:z.string(),
  ticketData: z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
  }),
  remarks: z.string().min(2).max(50),
  filePath: z.array(z.string()),
});

const CreateNewTicket: React.FC<CreateNewTicketProps> = ({
  dialogState,
  setDialogState,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketType: "",
      severity: "",
      customer_name:"",
      ticketData: {
        title: "",
        description: "",
      },
      remarks: "",
      filePath: [],
    },
  });

  
  const customers = useAtomValue(customersAtom)
  
  const { toast } = useToast();

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [fileNames,setFileNames] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile === null) {
      toast({
        title: "Document Upload",
        description: "Please select a file before uploading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await uploadDocument(selectedFile);
      console.log(response);

      setFileNames((prevFileNames) =>[
        ...prevFileNames,
        response.data.filename,
      ]);
      
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        response.data.new_filename,
      ]);
      toast({
        title: "Document Upload",
        description: "Document uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Document Upload",
        description: "Failed to upload document to the server.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRes = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, _index) => _index !== index));
  };

  const handleCreateTicket = async (values: z.infer<typeof formSchema>) => {
    try {
      await createTicket(values);
      form.reset();
      setDialogState();
      setUploadedFiles([]);
      toast({
        title: "Ticket Creation",
        description: "Ticket created succesfully",
        variant: "default",
      });
      history.go(0);

    
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  useEffect(() => {
    form.setValue("filePath", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Add New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new ticket
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[450px] p-2">
          <Form {...form}>
            <form className="flex flex-col gap-2 p-1">
              <FormField
                control={form.control}
                name="ticketType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ticket Type" />
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



              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customers</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Customers" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
            
                        {customers.map((value, index) =>(
                          <SelectItem value={value.customer_name} key={index}>{value.customer_name}</SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="ticketData.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ticketData.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Input placeholder="Remarks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {fileNames.map((value, index) => (
                  <div className="flex pr-1 mb-3" key={index}>
                    <div className="relative group px-2 py-1 bg-primary rounded-md">
                      <p className="text-xs">{value}</p>
                      <XCircle
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 hidden group-hover:block cursor-pointer"
                        onClick={() => handleDeleteRes(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-3 mt-2">
                <Label>Attachments</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
              </div>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(handleCreateTicket)}>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewTicket;
