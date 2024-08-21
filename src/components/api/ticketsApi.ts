import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axiosInstance";

export const getTicketDetails = async (id: any): Promise<AxiosResponse> => {
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

export const submitResolution = async (
  files: any,
  ticket_id: any,
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
  ticketId: number,
  id: string
): Promise<AxiosResponse> => {
  return axiosInstance.post(`/assign_ticket/${id}`, {
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