import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import createError from "http-errors";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    // Check if token exists
    if (!token) {
      throw createError.Unauthorized("Unauthorized - Token not provided");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    if (!decoded || !decoded.userId) {
      throw createError.Unauthorized("Unauthorized - Invalid Token");
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw createError.NotFound("User not found");
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (err) {
    // Handle JWT verification errors
    const message =
      err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
        ? "Unauthorized - Invalid or Expired Token"
        : err.message;

    next(createError(401, message));
  }
};