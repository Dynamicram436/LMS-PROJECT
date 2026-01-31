import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

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

export const register = asyncHandler(async (req, res) => {
  const { userid, password, name, rollno, courseName, role } = req.body;

  // Validate required fields
  if (!userid || !password || !name || !rollno) {
    return res.status(400).json({
      message:
        "Missing required fields: userid, password, name, rollno",
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
        $or: [{ userid }, { rollno }],
      }),
    "Failed to check existing user",
  );

  if (existingUser) {
    const field =
      existingUser.userid === userid
        ? "userid"
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
});

export const getUser = asyncHandler(async (req, res) => {
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
});

export const login = asyncHandler(async (req, res) => {
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
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "profile-pictures");
    // Create directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }).then(() => {
      cb(null, uploadDir);
    }).catch((err) => {
      cb(err, uploadDir);
    });
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, req.user.userid + "-" + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export multer upload middleware
export const uploadProfilePicture = upload.single("profilePicture");

// Upload profile picture controller
export const uploadProfilePic = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded. Please select an image file.",
    });
  }

  // Check database connection
  if (!isDatabaseConnected()) {
    // Clean up uploaded file if DB is down
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkErr) {
      console.error("Failed to clean up file:", unlinkErr);
    }
    return res.status(503).json({
      message: "Service temporarily unavailable - Database connection failed",
      error: "Database connection unavailable. Please contact administrator.",
    });
  }

  try {
    // @ts-ignore - userid is available from auth middleware
    const user = await withDatabaseCheck(
      () => User.findOne({ userid: req.user.userid }),
      "Failed to find user"
    );

    if (!user) {
      // Clean up uploaded file
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Failed to clean up file:", unlinkErr);
      }
      return res.status(404).json({ message: "User not found" });
    }

    // If user already has a profile picture, delete the old one
    if (user.profilePicture) {
      const oldFilePath = path.join(process.cwd(), "uploads", "profile-pictures", path.basename(user.profilePicture));
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.log("Could not delete old profile picture:", err.message);
      }
    }

    // Save new profile picture path
    const relativePath = `/uploads/profile-pictures/${req.file.filename}`;
    user.profilePicture = relativePath;
    
    await withDatabaseCheck(
      () => user.save(),
      "Failed to save profile picture"
    );

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: relativePath,
    });

  } catch (error) {
    // Clean up uploaded file on error
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkErr) {
      console.error("Failed to clean up file:", unlinkErr);
    }
    throw error;
  }
});

// Get profile picture controller
export const getProfilePic = asyncHandler(async (req, res) => {
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

  // @ts-ignore - userid is a valid field
  const user = await withDatabaseCheck(
    () => User.findOne({ userid: userid }).select("profilePicture"),
    "Failed to fetch user profile picture"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    profilePicture: user.profilePicture || null,
  });
});
