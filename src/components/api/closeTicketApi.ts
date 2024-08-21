import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const closeTicketApi = async (id: string): Promise<AxiosResponse> => {
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
