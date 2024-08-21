import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUsers } from "@/components/api/userApi";
import {
  assignTicket,
  closeTicket,
  getTicketDetails,
} from "@/components/api/ticketsApi";
import ResolutionTab from "@/components/resolution-tab";
import AuditTab from "@/components/audit-tab";
import { useToast } from "@/components/ui/use-toast";
import { BookOpenText } from "lucide-react";

const headerFields: string[] = [
  "ticket_id",
  "title",
  "type",
  "breach_status",
  "bucket",
  "customer_id",
  "raised_by_id",
  "raised_at",
  "severity",
  "sla_due",
  "status",
];

const IdPage = () => {
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
      console.log(response.data);

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
      if (value === "user") {
        setSelectUser(true);
        setSelectGroup(false);
        setAssignType(value);
        const response = await getUsers();
        setUsers(response.data.users);
      } else {
        setSelectGroup(true);
        setSelectUser(false);
        setAssignType(value);
        const response = await getUsers();
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssign = async () => {
    try {
      await assignTicket(
        assignType,
        assignToGroup,
        assignToUser,
        parseInt(ticketDetails?.ticket_id!),
        id!
      );
    } catch (error) {
      toast({
        title: "Ticket Assignment",
        description: "Failed to assign ticket to an user",
        variant: "destructive",
      });
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

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-3 p-4 rounded-md border bg-muted">
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
      </div>

      <Tabs defaultValue="description" className="max-w-screen-2xl">
        <div className="flex justify-between items-center">
          <TabsList className="my-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                disabled={
                  ticketDetails?.username !== ticketDetails?.bucket ||
                  ticketDetails?.status === "closed"
                }
                className="float-end mr-4 mt-6 mb-5"
                variant="destructive"
              >
                Close Ticket
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

        <div className="p-4 bg-muted rounded-md border">
          <TabsContent value="description">
            <div className="flex items-center gap-2">
              <BookOpenText className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground">
                Description
              </p>
            </div>
            <p className="mt-4 p-2 bg-background rounded-md">
              {ticketDetails && ticketDetails.description}
            </p>
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
        <p className="text-xs font-bold text-muted-foreground">Assign</p>

        <div className="flex gap-2 mt-2">
          <Select
            onValueChange={(value) => handleUser(value)}
            disabled={ticketDetails?.username != ticketDetails?.bucket}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="group">Group</SelectItem>
            </SelectContent>
          </Select>

          {selectUser && (
            <Select onValueChange={(value) => setAssignToUser(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Users" />
              </SelectTrigger>
              <SelectContent>
                {users.map((value, index) => (
                  <SelectItem value={value.username} key={index}>
                    {value.username}
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
                    {value.group_name}
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
          >
            Assign
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

export default IdPage;
