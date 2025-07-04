import { axiosInstance } from "@/lib/axios";

export const GenerateQuiz = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/generate", data);
    console.log(res.data);
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
    console.log(res.data);
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
    console.log(res.data);
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
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    return null;
  }
};
export const GetQuizReview = async (id) => {
  try {
    const res = await axiosInstance.get(`/quiz/review/${id}`);
    console.log(res.data);
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
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Quiz template generation failed."
    );
  }
};