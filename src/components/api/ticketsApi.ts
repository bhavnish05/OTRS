import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getTicketDetails = async (id: any): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/ticket_details/${id}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};

export const createTicket = async (
  ticketData: object
): Promise<AxiosResponse> => {
  return axios.post("http://10.101.104.140:8090/create_ticket", ticketData, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const closeTicket = async (id: string): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/close_ticket/${id}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};

export const submitResolution = async (
  files: any,
  ticket_id: any,
  title: string,
  description: string
) => {
  return axios.post(
    `http://10.101.104.140:8090/submit_resolution/${ticket_id}`,
    { description, fileNames: files, title },
    {
      headers: {
        Authorization: getToken(),
        Accept: "application/json",
      },
    }
  );
};

export const pickupTicket = async (id: string): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/ticket_pickup/${id}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};

export const assignTicket = async (
  assignType: string,
  assignToGroup: string,
  assignToUser: string,
  ticketId: number,
  id: string
): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/assign_ticket/${id}`,
    { assignType, assignToGroup, assignToUser, ticketId },
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};

export const downloadDocument = async (
  document_name: string
): Promise<AxiosResponse> => {
  return axios.post(
    `http://10.101.104.140:8090/download_document/${document_name}`,
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
