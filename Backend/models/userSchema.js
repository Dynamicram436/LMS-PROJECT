import mongoose from "mongoose";
import { createInMemoryUserModel } from "../utils/inMemoryModel.js";

const videoProgressSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  watchedDuration: {
    type: Number, // in seconds
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  videos: [videoProgressSchema],
  exam: {
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttempt: Date,
    answers: [
      {
        questionIndex: Number,
        selectedOption: Number,
        isCorrect: Boolean,
        question: String,
        correctAnswer: Number,
        options: [String],
      },
    ],
  },
  examAttempts: [
    {
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
      passed: {
        type: Boolean,
        default: false,
      },
      attemptNumber: {
        type: Number,
        required: true,
      },
      attemptDate: {
        type: Date,
        default: Date.now,
      },
      answers: [
        {
          questionIndex: Number,
          selectedOption: Number,
          isCorrect: Boolean,
          question: String,
          correctAnswer: Number,
          options: [String],
        },
      ],
    },
  ],
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isCourseCompleted: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

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
      required: false, // Email is optional
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
    selectedCourses: [
      {
        courseId: String,
        courseName: String,
        selectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    courseProgress: [courseProgressSchema],
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    lastLogin: Date,
    profilePicture: {
      type: String,
      default: null,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create the real MongoDB model or use in-memory fallback
let User;
if (mongoose.connection.readyState === 1) {
  // MongoDB is connected
  User = mongoose.models.User || mongoose.model("User", userSchema);
} else {
  // Use in-memory model for development
  console.log("📦 Using in-memory User model for development");
  User = createInMemoryUserModel();
}

export default User;