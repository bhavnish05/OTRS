export type OTPValidate = {
  otp: number;
  uniqueID: string;
  userName: string;
};

export type Tickets = {
  ticket_id: number;
  customer_id: number;
  customer_name: string;
  type: string;
  raised_at: string;
  title: string;
  description: string;
  severity: string;
  sla_due: string;
  sla_start: string;
  priority: string;
  data: string;
  raised_by_id: string;
  bucket: string;
  status: string;
  file_paths: string;
  canPick: boolean;
  canAssign: boolean;
  assignedToMe: boolean;
};

export type TicketDetails = {
  breach_status: string;
  bucket: string;
  canAssign: boolean;
  canPick: boolean;
  customer_id: number;
  data: string;
  description: string;
  eventLog: { event_description: string; event_datetime: string }[];
  file_paths: string;
  raised_at: string;
  raised_by_id: number;
  resolutions: {
    customer_id: number;
    description: string;
    id: number;
    insert_date: string;
    resolution_by: number;
    supporting_files: string[];
    ticket_id: number;
    title: string;
    transaction_id: number;
  }[];
  severity: string;
  sla_due: string;
  status: string;
  ticket_id: number;
  customer_name: string;
  title: string;
  type: string;
  username: string;
  // priority: string;
  // assignedToMe: boolean;
};
