import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const getLoggedUSers = async (): Promise<AxiosResponse> => {
  return axios.get(
    "http://10.101.104.140:8090/logged_in_users",
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};