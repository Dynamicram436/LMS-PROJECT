import mongoose from "mongoose";

const examAttemptDatabaseSchema = new mongoose.Schema(
  {
    attemptId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    chapterId: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    chapterName: {
      type: String,
      required: true
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound index for faster queries
examAttemptDatabaseSchema.index({ attemptId: 1 }, { unique: true });
examAttemptDatabaseSchema.index({ userId: 1, courseId: 1 });
examAttemptDatabaseSchema.index({ userId: 1, isActive: 1 });

const ExamAttemptDatabase = mongoose.models.ExamAttemptDatabase || mongoose.model("ExamAttemptDatabase", examAttemptDatabaseSchema);

export default ExamAttemptDatabase;
