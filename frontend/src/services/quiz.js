import { axiosInstance } from "@/lib/axios";

export const GenerateQuiz = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/generate", data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quiz generation failed."
    );
  }
};
export const GetQuiz = async () => {
  try {
    const res = await axiosInstance.get("/quiz");
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quiz generation failed."
    );
  }
};
export const GetAllQuizes = async () => {
  try {
    const res = await axiosInstance.get(`/quiz/past`);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quizzes Retrieval failed."
    );
  }
};
export const LeaveQuiz = async () => {
  try {
    const res = await axiosInstance.post("/quiz/leave");
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    return null;
  }
};
export const GetQuizReview = async (id) => {
  try {
    const res = await axiosInstance.get(`/quiz/review/${id}`);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quiz review retrieval failed."
    );
  }
}
export const GetQuizTemplate = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/template", data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quiz template generation failed."
    );
  }
};