import { OTPValidate } from "@/lib/types";
import axios, { AxiosResponse } from "axios";

export const getToken = (): string => {
  return localStorage.getItem("token") || "";
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  if (localStorage.getItem("token")) return true;
  return false;
};

export const loginAPI = (data: {
  username: string;
  password: string;
}): Promise<AxiosResponse> => {
  const token = btoa(`${data.username}:${data.password}`);

  return axios.post(
    "http://10.101.104.140:8090/login",
    {},
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
    }
  );
};

export const validate = async (data: OTPValidate) => {
  return axios.post("http://10.101.104.140:8090/validate_otp", data);
};

export const logout = async () => {
  return axios.post(
    "http://10.101.104.140:8090/logout",
    {},
    {
      headers: {
        Authorization: getToken(),
      },
    }
  );
};
