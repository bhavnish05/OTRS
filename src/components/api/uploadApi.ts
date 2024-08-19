import axios from "axios";
import { getToken } from "./authApi";

export const uploadApi = async (file: string | Blob | null) => {
  const formData = new FormData();
  formData.append("file", file!);

  return axios.post(
    "http://10.101.104.140:8090/file_upload",
    formData,
    {
      headers: {
        Authorization: getToken(),
        Accept: 'application/json',
        'Content-Type': 'text/pdf',
      },
    }
  );
};
