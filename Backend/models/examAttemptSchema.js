import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    attemptId: {
      type: String,
      required: true,
      unique: true
    },
    attemptNumber: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    answers: [{
      questionIndex: {
        type: Number,
        required: true
      },
      selectedOption: {
        type: Number,
        required: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      },
      question: String,
      correctAnswer: Number,
      options: [String]
    }],
    attemptDate: {
      type: Date,
      default: Date.now
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound index for faster queries
examAttemptSchema.index({ userId: 1, courseId: 1, attemptNumber: 1 });
examAttemptSchema.index({ userId: 1, attemptDate: -1 });

const ExamAttempt = mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", examAttemptSchema);

export default ExamAttempt;