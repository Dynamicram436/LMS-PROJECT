import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to check if database is connected
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1; // 1 means connected
};

// Helper function to handle database operations safely
const withDatabaseCheck = async (operation, errorMessage) => {
  if (!isDatabaseConnected()) {
    throw new Error(
      "Database connection unavailable. Please check MongoDB connection.",
    );
  }
  return await operation();
};

export const register = async (req, res) => {
  try {
    const { userid, email, password, name, rollno, courseName, role } =
      req.body;

    // Validate required fields
    if (!userid || !email || !password || !name || !rollno) {
      return res.status(400).json({
        message:
          "Missing required fields: userid, email, password, name, rollno",
      });
    }

    // Check database connection before proceeding
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "Service temporarily unavailable - Database connection failed",
        error: "Database connection unavailable. Please contact administrator.",
      });
    }

    // Check if user already exists
    const existingUser = await withDatabaseCheck(
      () =>
        User.findOne({
          $or: [{ userid }, { email }, { rollno }],
        }),
      "Failed to check existing user",
    );

    if (existingUser) {
      const field =
        existingUser.userid === userid
          ? "userid"
          : existingUser.email === email
            ? "email"
            : "rollno";
      return res.status(400).json({
        message: `User with this ${field} already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await withDatabaseCheck(
      () =>
        User.create({
          userid,
          email,
          password: hashedPassword,
          name,
          rollno,
          courseName,
          role: role || "student",
        }),
      "Failed to create user",
    );

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    const token = jwt.sign(
      { id: newUser._id, userid: newUser.userid, role: newUser.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      data: userResponse,
      token,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    // Handle specific error types
    if (error.message.includes("Database connection")) {
      return res.status(503).json({
        message: "Registration service temporarily unavailable",
        error:
          "Database connection failed. Please try again later or contact administrator.",
      });
    }

    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `User with this ${field} already exists`,
      });
    }

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        message: "Missing required parameter: userid",
      });
    }

    // Check database connection
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "Service temporarily unavailable - Database connection failed",
        error: "Database connection unavailable. Please contact administrator.",
      });
    }

    // @ts-ignore - userid is a valid field in the User schema
    const user = await withDatabaseCheck(
      () => User.findOne({ userid: userid }).select("-password"),
      "Failed to fetch user",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.error("❌ Get user error:", error);

    if (error.message.includes("Database connection")) {
      return res.status(503).json({
        message: "User service temporarily unavailable",
        error: "Database connection failed. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Validate required fields
    if (!userid || !password) {
      return res.status(400).json({
        message: "Missing required fields: userid and password",
      });
    }

    // Check database connection
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "Service temporarily unavailable - Database connection failed",
        error: "Database connection unavailable. Please contact administrator.",
      });
    }

    // @ts-ignore - userid is a valid field in the User schema
    const user = await withDatabaseCheck(
      () => User.findOne({ userid: userid }),
      "Failed to find user",
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await withDatabaseCheck(
      () => user.save(),
      "Failed to update login timestamp",
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign(
      { id: user._id, userid: user.userid, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "User logged in successfully",
      data: userResponse,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    if (error.message.includes("Database connection")) {
      return res.status(503).json({
        message: "Login service temporarily unavailable",
        error: "Database connection failed. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to login user",
      error: error.message,
    });
  }
};
