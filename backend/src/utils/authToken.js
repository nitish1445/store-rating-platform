import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  try {
    const payload = {
      id: user.id,
      role: user.role || "admin",
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    throw error;
  }
};
