import mongoose from "mongoose";

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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rollno: {
      type: String,
      required: true,
      unique: true,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
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

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ rollno: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
