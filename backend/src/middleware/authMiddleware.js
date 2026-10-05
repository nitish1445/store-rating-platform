import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      const error = new Error("Authentication token is missing.");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      const error = new Error("Invalid authentication token.");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findUserById(decoded.id);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("User not authenticated.");
      error.statusCode = 401;
      return next(error);
    }

    if (req.user.role !== requiredRole) {
      const error = new Error("User does not have the required role.");
      error.statusCode = 403;
      return next(error);
    }

    return next();
  };
};
