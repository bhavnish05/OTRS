import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axiosInstance";

export const getTicketDetails = async (id: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`/ticket_details/${id}`, {});
};

export const createTicket = async (
  ticketData: object
): Promise<AxiosResponse> => {
  return axiosInstance.post("/create_ticket", ticketData);
};

export const closeTicket = async (id: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`/close_ticket/${id}`, {});
};

export const filterTickets = async (
  ticketFilters: any
): Promise<AxiosResponse> => {
  return axiosInstance.post("/filters", ticketFilters);
};

export const submitResolution = async (
  files: string[],
  ticket_id: number,
  title: string,
  description: string
) => {
  return axiosInstance.post(`/submit_resolution/${ticket_id}`, {
    description,
    fileNames: files,
    title,
  });
};

export const pickupTicket = async (
  ticket_id: number
): Promise<AxiosResponse> => {
  return axiosInstance.post(`/ticket_pickup/${ticket_id}`, {});
};

export const assignTicket = async (
  assignType: string,
  assignToGroup: string,
  assignToUser: string,
  ticketId: number
): Promise<AxiosResponse> => {
  return axiosInstance.post(`/assign_ticket/${ticketId}`, {
    assignType,
    assignToGroup,
    assignToUser,
    ticketId,
  });
};

export const downloadDocument = async (
  document_name: string
): Promise<AxiosResponse<ArrayBuffer>> => {
  return axiosInstance.post(
    `/download_document/${document_name}`,
    {},
    {
      responseType: "arraybuffer",
    }
  );
};

export const uploadDocument = async (file: string | Blob | null) => {
  const formData = new FormData();
  formData.append("file", file!);

  return axiosInstance.post("/file_upload", formData);
};

export const updateDescription = async (
  ticket_id: number,
  description: string
): Promise<AxiosResponse> => {
  return axiosInstance.put(`/update_ticket_description/${ticket_id}`, {
    description,
  });
};

export const downloadTicket = async (
  ticket_id: any
): Promise<AxiosResponse<ArrayBuffer>> => {
  return axiosInstance.get(`/export_ticket/${ticket_id}`, {
    responseType: "arraybuffer",
  });
};

export const markFalsePositive = async (
  ticket_id: number
): Promise<AxiosResponse> => {
  return axiosInstance.post(`/false_positive_ticket/${ticket_id}`, {});
};
