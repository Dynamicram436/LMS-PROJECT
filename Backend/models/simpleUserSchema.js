import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    rollno: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
