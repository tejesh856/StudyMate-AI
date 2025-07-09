import { axiosInstance } from "@/lib/axios";
import axios from "axios";

export const CheckAuth = async () => {
  try {
    const res = await axiosInstance.get("auth/check");
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw error;
    //return null;
  }
};
export const Signup = async (data) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Signup failed. Please try again."
    );
  }
};
export const Login = async (data) => {
  try {
    const res = await axiosInstance.post("auth/login", data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Login failed. Please try again."
    );
  }
};
export const Logout = async () => {
  try {
    const res = await axiosInstance.post("auth/logout");
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Logout failed. Please try again."
    );
  }
};
export const UpdateProfile = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/update-profile", data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Update failed. Please try again."
    );
  }
};

export const UpdatePassword = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/update-password", data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "password Update failed. Please try again."
    );
  }
};