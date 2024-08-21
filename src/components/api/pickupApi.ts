import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const pickupApi = async (id:string): Promise<AxiosResponse> => {
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
