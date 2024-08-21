import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getCustomerDetails = async (): Promise<AxiosResponse> => {
  return axios.get(
    "http://10.101.104.140:8090/customer_details",
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};