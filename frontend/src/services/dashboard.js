import { axiosInstance } from "@/lib/axios";

export const getProgressResume=async()=>{
  try {
    const response = await axiosInstance.get(`/progress/resume`);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
}
export const getStats=async()=>{
  try {
    const response = await axiosInstance.get(`/stats`);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
}