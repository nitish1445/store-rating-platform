import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import AuthRoutes from "./src/routes/AuthRoutes.js";
import UserRoutes from "./src/routes/userRoutes.js";
import OwnerRoutes from "./src/routes/ownerRoutes.js";
import AdminRoutes from "./src/routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Routes
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/owner", OwnerRoutes);
app.use("/admin", AdminRoutes);

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;
  console.log("Error Found", { ErrorMessage, StatusCode });

  res.status(StatusCode).json({ message: ErrorMessage });
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
