import axiosInstance from "@/lib/axiosInstance";
import { AxiosResponse } from "axios";

export const getUsers = async (): Promise<AxiosResponse> => {
  return axiosInstance.get("/user_group_list");
};

export const getLoggedUsers = async (): Promise<AxiosResponse> => {
  return axiosInstance.get("http://10.101.104.140:8090/logged_in_users");
};

export const getCustomerDetails = async (): Promise<AxiosResponse> => {
  return axiosInstance.get("http://10.101.104.140:8090/customer_details");
};
