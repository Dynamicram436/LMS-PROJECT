import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema(
  {
    chapterId: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["English", "Telugu", "Hindi", "Mathematics", "Science", "Social Studies"],
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
          },
        ],
        correctAnswer: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index for faster queries
examQuestionSchema.index({ chapterId: 1, category: 1 }, { unique: true });

const ExamQuestion =
  mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", examQuestionSchema);

export default ExamQuestion;

