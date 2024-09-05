import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axiosInstance";

export const getTickets = async (): Promise<AxiosResponse> => {
  return axiosInstance.post("/dashboard", {});
};

export const getCustomers = async ():Promise<AxiosResponse> =>{
  return axiosInstance.get("/customer_details",{});
}
