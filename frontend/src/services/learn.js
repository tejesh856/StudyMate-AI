import { axiosInstance } from "@/lib/axios";

export const generateCourseFlow = async (data) => {
  try {
    const response = await axiosInstance.post("/learn/generate-course-flow",data);
    return response.data;
  } catch (error) {
    console.error("Error generating topic flow:", error);
    throw error;
  }
};
export const generateCourse = async (data) => {
  try {
    console.log('data',data);
    const response = await axiosInstance.post(`/learn/generate-course`,data);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
};
export const getCourses = async () => {
  try {
    const response = await axiosInstance.get(`/learn/courses`);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
};
export const getCourse=async(id)=>{
  try {
    const response = await axiosInstance.get(`/learn/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
}
export const updateCourse=async(id,data)=>{
  try {
    const response = await axiosInstance.patch(`/learn/course/${id}`,data);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
}
export const markSubChapterComplete=async(data)=>{
  try {
    const response = await axiosInstance.post(`/learn/complete`,data);
    return response.data;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw error;
  }
}
