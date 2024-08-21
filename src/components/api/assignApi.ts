import axios, { AxiosResponse } from "axios"
import { getToken } from "./authApi";

export const assign =async (assignType:string, assignToGroup:string, assignToUser:string,ticketId:number,id:string): Promise<AxiosResponse> => {
    
    return axios.post(
        `http://10.101.104.140:8090/assign_ticket/${id}`,
        { assignType, assignToGroup, assignToUser, ticketId },
        {
          headers: {
            Authorization: getToken(),
          },
        }
      );
}