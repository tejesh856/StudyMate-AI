import bcrypt from "bcryptjs";
import { generateAuthToken, getRandomHexColor } from "../lib/utils.js";
import User from "../models/user.model.js";
import createError from "http-errors";

//sign up controller
export const Signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
      throw createError(400, "Name, email, and password are required.");
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw createError(400, "Invalid email format.");
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw createError(
        400,
        "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
      );
    }
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
  if (!email || !password) {
      throw createError(400, "Email, and password are required.");
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw createError(400, "Invalid email format.");
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw createError(
        400,
        "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
      );
    }
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
  const { name, email, profilePic } = req.body;
    if (!name || !email) {
      throw createError(400, "Name, email, and profilePic are required.");
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw createError(400, "Invalid email format.");
    }

  try {
    const user = await User.findById(req.user._id);

    if (!user) throw createError(404, `User not found`);

    // Check for email conflict
    if (user.email !== email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw createError(400, `Email already in use`);
      }
    }

    user.name = name;
    user.email = email;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        color: user.color,
      },
    });
  } catch (err) {
    next(err);
  }
};


//pasword update
export const updatePassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw createError(400, `Both fields are required`);
  }

  if (newPassword !== confirmPassword) {
    throw createError(400, `Passwords do not match`);
  }

  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(newPassword)) {
    throw createError(400, `Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit`);
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) throw createError(404, `User not found`);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
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