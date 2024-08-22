import { removeToken } from "@/components/api/authApi";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.101.104.140:8090",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      // window.location.href = new URL("/maintenance", window.origin).toString();
    } else {
      if (error.response.status === 401) {
        removeToken();
        window.location.href = new URL("/login", window.origin).toString();
      } else {
        console.error("API Error", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
