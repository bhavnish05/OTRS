import axiosInstance from "@/lib/axiosInstance";

export const uploadApi = async (file: string | Blob | null) => {
  const formData = new FormData();
  formData.append("file", file!);

  return axiosInstance.post("/file_upload", formData);
};
