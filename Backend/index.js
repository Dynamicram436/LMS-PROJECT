import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import authRoute from "./routes/authRoute.js";
import examRoute from "./routes/examRoute.js";
import connectDB from "./utils/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(8000, () => console.log("Server running on port 8000"));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Routes
app.get("/", (req, res) => res.send("EduTrack API is running"));

app.use("/api/auth", authRoute);
app.use("/api/exam", examRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: errors.join(", "),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field}`,
      error: `${field} already exists`,
    });
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: "Resource not found",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: "Please log in again",
    });
  }


  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      error: "Please log in again",
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.stack
        : "Something went wrong",
  });
});

// Handle 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// app.listen(8000, () => console.log("Server running on port 8000"));
