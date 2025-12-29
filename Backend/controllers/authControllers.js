import connectDB from "../utils/db.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { userid, email, password, name, rollno, courseName, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userid,
      email,
      password: hashedPassword,
      name,
      rollno,
      courseName,
      role: role || "student",
    });

    const token = jwt.sign(
      { id: newUser._id, userid: newUser.userid, role: newUser.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userid } = req.params;

    // @ts-ignore - userid is a valid field in the User schema
    const user = await User.findOne({ userid: userid }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    await connectDB();
    const { userid, password } = req.body;

    // @ts-ignore - userid is a valid field in the User schema
    const user = await User.findOne({ userid: userid });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userid: user.userid, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ message: "User logged in successfully", data: user, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to login user", error: error.message });
  }
};
