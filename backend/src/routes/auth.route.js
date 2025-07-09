import express from "express";
import {
  Signup,
  Login,
  Logout,
  updateProfile,
  checkAuth,
  updatePassword,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

//authentication routes
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

//update profile
router.post("/update-profile", protectRoute, updateProfile);
router.post("/update-password", protectRoute, updatePassword);

//check authentication
router.get("/check", protectRoute, checkAuth);

export default router;