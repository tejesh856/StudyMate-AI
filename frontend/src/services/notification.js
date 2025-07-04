import { axiosInstance } from "@/lib/axios";
export const getNotifications = async (data) => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error generating topic flow:", error);
    throw error;
  }
};
export const markReadNotifications = async (id) => {
  try {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error generating topic flow:", error);
    throw error;
  }
};