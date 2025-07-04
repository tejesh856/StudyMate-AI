import axios from "axios";
export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MODE === "development"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : "/api",
  withCredentials: true,
});