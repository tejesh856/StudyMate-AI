import express from "express";
import {
  Signup,
  Login,
  Logout,
  updateProfile,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

//authentication routes
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

//update profile
router.post("/update-profile", protectRoute, updateProfile);

//check authentication
router.get("/check", protectRoute, checkAuth);

export default router;