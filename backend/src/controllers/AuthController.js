import bcrypt from "bcrypt";
import User from "../models/authModel.js";
import { generateToken } from "../utils/authToken.js";

export const SignupController = async (req, res, next) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
      const error = new Error("All fields are required.");
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedAddress = address.trim();

    // Name: 20-60 characters
    if (trimmedName.length < 20 || trimmedName.length > 60) {
      const error = new Error("Name must be between 20 and 60 characters.");
      error.statusCode = 400;
      throw error;
    }

    // Address: maximum 400 characters
    if (trimmedAddress.length === 0 || trimmedAddress.length > 400) {
      const error = new Error(
        "Address is required and cannot exceed 400 characters.",
      );
      error.statusCode = 400;
      throw error;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      const error = new Error("Please enter a valid email address.");
      error.statusCode = 400;
      throw error;
    }

    // Password: 8-16 characters
    if (password.length < 8 || password.length > 16) {
      const error = new Error("Password must be between 8 and 16 characters.");
      error.statusCode = 400;
      throw error;
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      const error = new Error(
        "Password must contain at least one uppercase letter.",
      );
      error.statusCode = 400;
      throw error;
    }

    // At least one special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      const error = new Error(
        "Password must contain at least one special character.",
      );
      error.statusCode = 400;
      throw error;
    }

    // CHECK EXISTING USER
    const existingUser = await User.findUserByEmail(trimmedEmail);

    if (existingUser) {
      const error = new Error("User with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const newUser = await User.createUser({
      name: trimmedName,
      email: trimmedEmail,
      address: trimmedAddress,
      password: hashPassword,
      role: "user",
    });

    const token = generateToken(newUser);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      userData: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
      navigation:
        newUser.role === "admin"
          ? "/admin"
          : newUser.role === "user"
            ? "/user"
            : "/owner",
    });
  } catch (error) {
    next(error);
  }
};

export const LoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      const error = new Error("Please enter a valid email address.");
      error.statusCode = 400;
      throw error;
    }

    // Password length
    if (password.length < 8 || password.length > 16) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findUserByEmail(trimmedEmail);

    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: `Login successful as ${user.name}.`,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      navigation:
        user.role === "admin"
          ? "/admin"
          : user.role === "user"
            ? "/user"
            : "/owner",
    });
  } catch (error) {
    next(error);
  }
};

export const LogoutController = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully Done.",
    });
  } catch (error) {
    next(error);
  }
};
