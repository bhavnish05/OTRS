import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const createTicket =async (ticketData: object): Promise<AxiosResponse> => {
  return axios.post(
    "http://10.101.104.140:8090/create_ticket",
    ticketData,
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};



