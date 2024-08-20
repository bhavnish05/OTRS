import axiosInstance from "@/lib/axiosInstance";
import { AxiosResponse } from "axios";

export const getUsers = async (): Promise<AxiosResponse> => {
  return axiosInstance.get("/user_group_list");
};
