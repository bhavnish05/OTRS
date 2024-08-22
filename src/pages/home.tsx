
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { useNavigate, useParams } from "react-router-dom";
import KPI from "@/components/kpi";
import App from "@/components/old_tickets_table";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";

// import { TicketDetails } from "@/lib/types";
import {
  uploadDocument,
} from "@/components/api/ticketsApi";
import { createTicket } from "@/components/api/createTicketApi";
import { getCustomerDetails } from "@/components/api/customerApi";

import { TicketFilters } from "@/components/api/filterApi";
import { getUsers } from "@/components/api/userApi";
import { assign } from "@/components/api/assignApi";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PlusCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [selectUser, setSelectUser] = useState(false);
  const [selectGroup, setSelectGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignType, setAssignType] = useState("");
  const [groups, setGroups] = useState([]);
  const [assignToGroup, setAssignToGroup] = useState("");
  const [assignToUser, setAssignToUser] = useState("");
  const [ticketStatus, setTicketStatus] = useState(false);
  const [currentBucket, setCurrentBucket] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [customerDetails, setCustomerDetails] = useState<{ customer_id: number; customer_name: string }[]>([]);
  const [assignDialog, setAssignDialog] = useState(false);
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const [FiltersData, setFiltersData] = useState({
    sort_by: "ticket_id",
    sort_order: "asc",
    start_date: "",
    end_date: "",
    ticket_id: 0,
    customer_id: 0,
    customer_name: "",
    type: "",
    title: "",
    bucket: "",
    status: "",
    severity: "",
  });
  const processGroups = (groups: any[]) => {
    const uniqueGroups = new Map();

    groups.forEach(group => {
      const key = `${group.group_name}-${group.customer_id}`;
      if (!uniqueGroups.has(key)) {
        uniqueGroups.set(key, group);
      }
    });

    return Array.from(uniqueGroups.values());
  };

  const [ticketData, setTicketData] = useState({

    ticketType: "",
    severity: "",
    ticketData: {
      title: "",
      description: "",
    },
    remarks: "",
    filePath: []

  });

  const handleFilterChange = (key, value) => {
    setFiltersData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === "title" || id === "description") {
      setTicketData(prevState => ({
        ...prevState,
        ticketData: {
          ...prevState.ticketData,
          [id]: value
        }
      }));
    } else {
      setTicketData(prevState => ({
        ...prevState,
        [id]: value,
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };
  const handleUpload = async () => {
    if (file === null) {
      toast({
        title: "Document Upload",
        description: "Please select a file before uploading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await uploadDocument(file);

      startTransition(() => {
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          response.data.new_filename,
        ]);

        setTicketData((prevData) => ({
          ...prevData,
          filePath: [...prevData.filePath, response.data.new_filename],
        }));
        console.log("ResponseforUpload", response.data.new_filename);
        setFile(null);
        toast({
          title: "Document Upload",
          description: "Document uploaded successfully.",
          variant: "default",
        });
      });
    } catch (error) {
      toast({
        title: "Document Upload",
        description: "Failed to upload document.",
        variant: "destructive",
      });
    }
  };


  const handleSelectChange = (id: string, value: string | number) => {
    setTicketData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };



  const handleCreateTicket = async () => {
    console.log("Sending ticket data:", ticketData);
    try {
      const response = await createTicket(ticketData);
      console.log("Ticket created successfully", response.data);
      alert("Ticket created successfully:");
      setNewTicketDialogOpen(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  const handleApplyFilters = () => {
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };
    const processedData = {
      ...FiltersData,
      start_date: formatDate(FiltersData.start_date),
      end_date: formatDate(FiltersData.end_date),
      ticket_id: FiltersData.ticket_id ? parseInt(FiltersData.ticket_id) : 0,
    };
    const filteredData = Object.fromEntries(
      Object.entries(processedData).filter(
        ([key, value]) => value !== "" && value !== 0 && value !== undefined
      )
    );
    console.log("Processed Data:", processedData);
    console.log("Filtered Data:", filteredData);

    if (Object.keys(filteredData).length > 0) {

      console.log("Sending FiltersData:", filteredData);

      TicketFilters(filteredData)
        .then((response) => {
          console.log("API Response:", response.data.tickets);
          setFilteredResults(response.data.tickets);
        })
        .catch((error) => {
          console.error("Error applying filters:", error);
        });
    } else {
      console.log("No filters applied.");
    }
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await getCustomerDetails();
        console.log("getCustomerDetails", response.data.customer);
        if (Array.isArray(response.data.customer)) {
          setCustomerDetails(response.data.customer);
        } else if (response.data.customer && typeof response.data.customer === 'object') {
          setCustomerDetails([response.data.customer]);
        } else {
          console.error("Unexpected data format:", response.data.customer);
        }
      } catch (error: any) {
        console.error("Error fetching customer details:", error);
      }
    };
    fetchCustomerDetails();
  }, []);

  return (
    <div>
      <KPI />
      <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                // className="mt-5 mr-5 p-5 bg-blue-600 rounded-full"
                className="mt-5 mr-5 p-5 "
                variant="outline"
                onClick={() => setNewTicketDialogOpen(true)}
              >
                <span className="flex items-center">
                  <p className="mr-2">Create</p>
                  <PlusCircle className="h-4 w-4" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent >
              <p>Click here to create a New ticket</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {newTicketDialogOpen && (
          <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
            <DialogContent className=" overflow-auto">

              <DialogHeader>
                <DialogTitle>Add New Ticket</DialogTitle>
                <DialogDescription>Fill in the details to create a new ticket</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tickettype" className="text-left">
                    Ticket Type
                  </Label>

                  <Select
                    onValueChange={(value) => handleSelectChange("ticketType", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SR">Service Request</SelectItem>
                      <SelectItem value="issue">Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-left">
                    Severity
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("severity", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>

                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-left">
                    Title
                  </Label>
                  <Input id="title" type="text"
                    value={ticketData.ticketData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-left">
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    value={ticketData.ticketData.description}
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-left">
                    Remarks
                  </Label>
                  <Input id="remarks" type="text"
                    value={ticketData.remarks}
                    className="col-span-3"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Input id="file" type="file" onChange={handleFileChange} />
                  <Button
                    type="button"
                    onClick={handleUpload}
                  >
                    {isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>


              </div>
              <DialogFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleCreateTicket} >
                    Create Ticket
                  </Button>
                </SheetClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button className=" mt-5 mr-5 p-5 bg-violet-700" variant="outline">
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className=" overflow-x-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Apply Filters</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-2 ">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticketId" className="text-left">
                  Ticket Id
                </Label>
                <Input
                  id="ticketId"
                  type="number"
                  value={FiltersData.ticket_id}
                  onChange={(e) => handleFilterChange("ticket_id", parseInt(e.target.value) || '')}

                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tickettype" className="text-left">
                  Ticket Type
                </Label>

                <Select
                  value={FiltersData.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SR">Service Request</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticketBucket" className="text-left">
                  Ticket Bucket
                </Label>
                <Input
                  id="ticketBucket"
                  type="text"
                  value={FiltersData.bucket}
                  onChange={(e) => handleFilterChange("bucket", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdOn" className="text-left">
                  Created On
                </Label>
                <Input
                  id="createdOn"
                  type="date"
                  value={FiltersData.start_date}
                  onChange={(e) => handleFilterChange("start_date", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdBy" className="text-left">
                  Customer Name
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("customer_name", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Customer Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerDetails.map((user) => (
                      <SelectItem key={user.customer_id} value={user.customer_name}>
                        {user.customer_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdBy" className="text-left">
                  Customer id
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("customer_id", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Customer ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerDetails.map((user) => (
                      <SelectItem key={user.customer_id} value={user.customer_id}>
                        {user.customer_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-left">
                  Severity
                </Label>
                <Select
                  value={FiltersData.severity}
                  onValueChange={(value) => handleFilterChange("severity", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">S1</SelectItem>
                    <SelectItem value="S2">S2</SelectItem>
                    <SelectItem value="S3">S3</SelectItem>

                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Title" className="text-left">
                  Title
                </Label>
                <Input
                  id="Title"
                  type="text"
                  value={FiltersData.title}
                  onChange={(e) => handleFilterChange("title", e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-left">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={FiltersData.end_date}
                  onChange={(e) => handleFilterChange("end_date", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="breachStatus" className="text-left">
                  Status
                </Label>
                <Input
                  id="breachStatus"
                  type="text"
                  value={FiltersData.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleApplyFilters}>Apply</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-2">
        <App filteredResults={filteredResults} />
      </div>
    </div >
  );
};

export default Home;
