import { axiosInstance } from "@/lib/axios";

export const CheckAuth = async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    return null;
  }
};
export const Signup = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    console.log(res.data);
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
    const res = await axiosInstance.post("/auth/login", data);
    console.log(res.data);
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
    const res = await axiosInstance.post("/auth/logout");
    console.log(res.data);
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
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response?.data.error.message);
    throw (
      error.response?.data?.error.message || "Update failed. Please try again."
    );
  }
};