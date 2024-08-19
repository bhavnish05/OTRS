import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { removeToken } from "@/components/api/authApi";
import { TicketDetails } from "@/lib/types";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUsers } from "@/components/api/userApi";
import {
  assignTicket,
  closeTicket,
  getTicketDetails,
} from "@/components/api/ticketsApi";
import ResolutionTab from "@/components/resolution-tab";
import AuditTab from "@/components/audit-tab";

const IdPage = () => {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );

  const [selectUser, setSelectUser] = useState(false);
  const [selectGroup, setSelectGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [assignType, setAssignType] = useState("");
  const [assignToGroup, setAssignToGroup] = useState("");
  const [assignToUser, setAssignToUser] = useState("");

  const [assignDialog, setAssignDialog] = useState(false);
  const [closeTicketDialog, setCloseTicketDialog] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  async function handleDetailsFetch() {
    try {
      const response = await getTicketDetails(id);
      setTicketDetails(response.data);
      console.log(response.data);
    } catch (error) {
      removeToken();
      navigate("/login");
    }
  }

  useEffect(() => {
    handleDetailsFetch();
  }, [id]);

  const handleUser = async (value: string) => {
    if (ticketDetails?.username != ticketDetails?.bucket) {
      setAssignDialog(true);
    } else if (value === "user") {
      setSelectUser(true);
      setSelectGroup(false);
      setAssignType(value);
      try {
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data.users);
        setGroups(response.data.groups);
      } catch (error) {
        console.log(error);
      }
    } else if (value === "group") {
      setSelectGroup(true);
      setSelectUser(false);
      setAssignType(value);
      try {
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data.users);
        setGroups(response.data.groups);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAssign = async () => {
    try {
      const response = await assignTicket(
        assignType,
        assignToGroup,
        assignToUser,
        parseInt(ticketDetails?.ticket_id!),
        id!
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTicketClose = async () => {
    try {
      await closeTicket(id!);
      setCloseTicketDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-muted">
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
        <TabsList className="my-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <div className="p-4 bg-muted rounded-md max-w-full">
          <TabsContent value="description">
            <p className="text-xs font-bold text-muted-foreground">
              Description
            </p>
            <p>{ticketDetails && ticketDetails.description}</p>
          </TabsContent>

          <TabsContent value="resolution">
            <ResolutionTab ticketDetails={ticketDetails!} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTab ticketDetails={ticketDetails!} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="bg-muted rounded-md p-4 mt-2">
        <p className="text-xs font-bold text-muted-foreground">Assign</p>

        <div className="flex gap-2 mt-2">
          <Select onValueChange={(value) => handleUser(value)}>
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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={
              ticketDetails?.username != ticketDetails?.bucket ||
              ticketDetails?.status === "closed"
            }
            className="float-end mr-4 mt-6 mb-5"
            variant="destructive"
          >
            Close Ticket
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Are you sure, you want to close this ticket?
            </DialogTitle>
            <DialogDescription>This Action is irreversible!</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={handleTicketClose} variant="destructive">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket is not in your bucket!</DialogTitle>
            <DialogDescription>Cannot Assign!</DialogDescription>
          </DialogHeader>
          Try Assigning some other ticket.
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeTicketDialog} onOpenChange={setCloseTicketDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Closed Successfully</DialogTitle>
            <DialogDescription>
              The ticket has been closed and no further actions are required.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/")} variant="primary">
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdPage;
