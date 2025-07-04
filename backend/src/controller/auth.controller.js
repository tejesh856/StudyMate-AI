import bcrypt from "bcryptjs";
import { generateAuthToken, getRandomHexColor } from "../lib/utils.js";
import User from "../models/user.model.js";
import createError from "http-errors";

//sign up controller
export const Signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      throw createError(
        400,
        "User with this email already exists. Please log in."
      );
    }
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      color: getRandomHexColor(),
    });
    if (!newUser) {
      throw createError(500, "User registration failed. Please try again.");
    }

    generateAuthToken(newUser.id, res);
    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.json({
      success: true,
      message: "Sign up successfull",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

//login controller
export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createError(400, "Email not valid");
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw createError(400, "Password does not match");
    }

    generateAuthToken(user.id, res);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

//logout controller
export const Logout = (req, res, next) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

//update profile controller
export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw createError.Unauthorized("Unauthorized - Please log in");
    }

    if (!profilePic) {
      throw createError.BadRequest("Profile picture is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      throw createError.NotFound("User not found");
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//check auth controller
export const checkAuth = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};