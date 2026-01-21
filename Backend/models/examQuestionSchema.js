import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["English", "Telugu", "Hindi", "Mathematics", "Science", "Social Studies"],
    },
    chapterId: {
      type: Number,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
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
          }
        ],
        correctAnswer: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index for faster queries
examQuestionSchema.index({ category: 1, chapterId: 1 }, { unique: true });

const ExamQuestion =
  mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", examQuestionSchema);

export default ExamQuestion;

