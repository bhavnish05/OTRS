import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ResolutionTab from "@/components/ticket/resolution-tab";
import AuditTab from "@/components/ticket/audit-tab";
import DescriptionTab from "@/components/ticket/description-tab";
import {
  assignTicket,
  closeTicket,
  downloadTicket,
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

  const [isFalsePositive, setIsFalsePositive] = useState(
    ticketDetails?.isFalse || false
  );

  async function handleFetchTicketDetails() {
    try {
      const response = await getTicketDetails(id!);
      console.log(response);

      setIsFalsePositive(response.data.isFalse);

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
        await assignTicket(
          assignType,
          assignToGroup,
          assignToUser,
          ticketDetails?.ticket_id!
        );

        toast({
          title: "Ticket Assignment",
          description: "Ticket Assigned Succesfully",
          variant: "default",
        });

        history.go(0);
      } catch (error: any) {
        const statusCode = error?.response?.status;
        const message =
          error?.response?.data?.msg || "Failed to assign ticket to a user";

        toast({
          title: "Ticket Assignment",
          description:
            statusCode === 403 ? message : "Failed to assign ticket to a user",
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
    const s = ticketDetails?.ticket_id.toString();
    try {
      const response = await downloadTicket(s!);
      if (response.status === 200 && response.data instanceof ArrayBuffer) {
        const arrayBuffer = response.data;
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = s!;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Unexpected response status or data format");
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  const handleFalsePositive = async (value: boolean) => {
    try {
      if (value && ticketDetails) {
        const response = await markFalsePositive(ticketDetails.ticket_id);

        setIsFalsePositive(value);
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
              <Switch
                checked={isFalsePositive}
                onCheckedChange={handleFalsePositive}
              
              />
            </div>
            <Button className="" onClick={printPDF}>
              <Printer className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger
                disabled={
                  ticketDetails?.username !== ticketDetails?.bucket ||
                  ticketDetails?.status === "closed"
                }
                asChild
              >
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

        <div className="px-4 bg-muted rounded-md border">
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
                  <SelectItem
                    value={value.username}
                    key={index}
                    disabled={value.username === ticketDetails?.username}
                  >
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
