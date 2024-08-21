import axios from "axios";
import { getToken } from "./authApi";

// export const SubmitUuid = async (Uuid: any, id: string, title: string, description: string) => {
  export const SubmitUuid = async (fileNames: any, id: any, title: string, description: string) => {
  return axios.post(
    `http://10.101.104.140:8090/submit_resolution/ticket_details/${id}`,
    { title, description ,fileNames},
    {
      headers: {
        Authorization: getToken(),
        Accept: 'application/json',
      },
    }
  );
};
