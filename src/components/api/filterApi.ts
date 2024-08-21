import axios, { AxiosResponse } from "axios";
import { getToken } from "./authApi";

export const TicketFilters =async (FiltersData: object): Promise<AxiosResponse> => {
  try {
    const jsonData = JSON.stringify(FiltersData); // Convert object to JSON string
    
    const response = await axios.post(
      "http://10.101.104.140:8090/filters",
      jsonData,
      {
        headers: {
          Authorization: getToken(), 
          "Content-Type": "application/json", 
        },
      }
    );
    
    return response;
  } catch (error) {
    // Handle the error
    console.error("Error in TicketFilters:", error);
    throw error;
  }
};



