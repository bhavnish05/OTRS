import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ResolutionTab from "@/components/ticket/resolution-tab";
import AuditTab from "@/components/ticket/audit-tab";
import DescriptionTab from "@/components/ticket/description-tab";
import {
  assignTicket,
  closeTicket,
  getTicketDetails,
  markFalsePositive,
} from "@/components/api/ticketsApi";
import { getUsers } from "@/components/api/userApi";

import { TicketDetails } from "@/lib/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpenText,
  BookText,
  Check,
  PencilLine,
  Printer,
  User,
  Users,
  XCircle,
} from "lucide-react";
import TicketHeader from "@/components/ticket/ticket-header";

const headerFields: string[] = [
  "ticket_id",
  "customer_id",
  "title",
  "type",
  "breach_status",
  "bucket",
  "raised_by_id",
  "raised_at",
  "severity",
  "sla_due",
  "status",
];

const Ticket = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );

  const [selectUser, setSelectUser] = useState<boolean>(false);
  const [selectGroup, setSelectGroup] = useState<boolean>(false);
  const [users, setUsers] = useState<{ username: string }[]>([]);
  const [groups, setGroups] = useState<{ group_name: string }[]>([]);

  const [assignType, setAssignType] = useState<string>("");
  const [assignToGroup, setAssignToGroup] = useState<string>("");
  const [assignToUser, setAssignToUser] = useState<string>("");
  const [closeTicketDialog, setCloseTicketDialog] = useState<boolean>(false);

  async function handleFetchTicketDetails() {
    try {
      const response = await getTicketDetails(id);
      console.log(response);
      
      setTicketDetails(response.data);
    } catch (error) {
      toast({
        title: "Ticket Details",
        description: "Failed to fetch ticket details",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    handleFetchTicketDetails();
  }, [id]);

  const handleUser = async (value: string) => {
    try {
      const response = await getUsers();
     
      
      if (value === "user") {
        setSelectUser(true);
        setSelectGroup(false);
        setAssignType(value);
        setUsers(response.data.users);
      } else {
        setSelectGroup(true);
        setSelectUser(false);
        setAssignType(value);
        setGroups(response.data.groups);
      }
    } catch (error) {
      toast({
        title: "User Group",
        description: "Failed to fetch users and groups",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async () => {
    if (!assignType) {
      toast({
        title: "Ticket Assignment",
        description: "Please select a valid user or group.",
        variant: "destructive",
      });
    } else {
      try {
       const res = await assignTicket(
          assignType,
          assignToGroup,
          assignToUser,
          ticketDetails?.ticket_id!
        );

        console.log(res);
        

        toast({
          title: "Ticket Assignment",
          description: "Ticket Assigned Succesfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Ticket Assignment",
          description: "Failed to assign ticket to an user",
          variant: "destructive",
        });
      }
    }
  };

  const handleTicketClose = async () => {
    try {
      await closeTicket(id!);
      setCloseTicketDialog(true);
    } catch (error) {
      toast({
        title: "Ticket Closure",
        description: "Failed to close the ticket",
        variant: "destructive",
      });
    }
  };

  const printPDF = async () => {
    const input = document.getElementById("contentToPrint");
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const handleFalsePositive = async (value: boolean) => {
    try {
      if (value){
      const response = await markFalsePositive(ticketDetails?.ticket_id!);
      console.log(response);
      
      } 
    } catch (error) {
      toast({
        title: "False Positive",
        description: "Failed to mark the ticket as false positive.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4" id="contentToPrint">
      {/* <div className="grid grid-cols-3 gap-3 p-4 rounded-md border bg-muted">
        {ticketDetails &&
          headerFields.map(
            (field) =>
              (ticketDetails as any)[field] !== undefined && (
                <span className="" key={field}>
                  <p className="text-[9px] font-extrabold text-muted-foreground uppercase">
                    {field}
                  </p>
                  <p className="text-sm">{(ticketDetails as any)[field]}</p>
                </span>
              )
          )}
      </div> */}
      <TicketHeader ticketDetails={ticketDetails!} />

      <Tabs defaultValue="description" className="mt-2">
        <div className="flex justify-between items-center">
          <TabsList className="my-2">
            <TabsTrigger
              value="description"
              className="flex gap-2 items-center"
            >
              <BookOpenText className="h-4 w-4" />
              <p>Description</p>
            </TabsTrigger>
            <TabsTrigger value="resolution" className="flex gap-2 items-center">
              <PencilLine className="h-4 w-4" />
              <p>Resolutions</p>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex gap-2 items-center">
              <BookText className="h-4 w-4" />
              <p>Audit</p>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 items-end">
              <p className="text-[10px] font-semibold text-muted-foreground">
                Mark as false positive
              </p>
              <Switch onCheckedChange={handleFalsePositive} />
            </div>
            <Button className="" onClick={printPDF}>
              <Printer className="h-4 w-4" />
            </Button>

            <AlertDialog >
              <AlertDialogTrigger disabled={ticketDetails?.username !== ticketDetails?.bucket ||
                    ticketDetails?.status === "closed"}>
                <Button
                  disabled={
                    ticketDetails?.username !== ticketDetails?.bucket ||
                    ticketDetails?.status === "closed"
                  }
                  className="float-end flex gap-3 items-center"
                  variant="destructive"
                >
                  <p>Close Ticket</p>
                  <XCircle className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will close this ticket.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive"
                    onClick={handleTicketClose}
                  >
                    Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-md border">
          <TabsContent value="description">
            <DescriptionTab
              ticketDetails={ticketDetails!}
              fetchTicketDetails={handleFetchTicketDetails}
            />
          </TabsContent>

          <TabsContent value="resolution">
            <ResolutionTab
              ticketDetails={ticketDetails!}
              fetchTicketDetails={handleFetchTicketDetails}
            />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTab ticketDetails={ticketDetails!} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="bg-muted rounded-md border p-4 mt-2">
        <div className="flex gap-2 items-center">
          <Users className="h-3 w-3" />
          <p className="text-xs font-bold text-muted-foreground">Assign</p>
        </div>

        <div className="flex gap-2 mt-2">
          <Select
            onValueChange={(value) => handleUser(value)}
            disabled={ticketDetails?.username != ticketDetails?.bucket}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assign To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <span className="flex gap-2 items-center">
                  <User className="h-4 w-4" />
                  <p>User</p>
                </span>
              </SelectItem>
              <SelectItem value="group">
                <span className="flex gap-2 items-center">
                  <Users className="h-4 w-4" />
                  <p>Group</p>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {selectUser && (
            <Select onValueChange={(value) => setAssignToUser(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Users" />
              </SelectTrigger>
              <SelectContent>
                {users.map((value, index) => (
                  <SelectItem value={value.username} key={index} disabled={value.username === ticketDetails?.username}>
                    <span className="flex gap-2 items-center">
                      <User className="h-4 w-4" />
                      <p>{value.username}</p>
                    </span>
      
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectGroup && (
            <Select onValueChange={(value) => setAssignToGroup(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Groups" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((value, index) => (
                  <SelectItem value={value.group_name} key={index}>
                    <span className="flex gap-2 items-center">
                      <Users className="h-4 w-4" />
                      <p>{value.group_name}</p>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed"
            }
            onClick={handleAssign}
            className="flex gap-3 items-center"
          >
            <p>Assign</p>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={closeTicketDialog} onOpenChange={setCloseTicketDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Closed Successfully</DialogTitle>
            <DialogDescription>
              The ticket has been closed and no further actions are required.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ticket;
