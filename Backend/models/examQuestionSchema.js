import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["English", "Telugu", "Hindi", "Mathematics", "Science", "Social Studies"],
    },
    course: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    questions: [
      {
        qType: {
          type: String,
          required: true,
          enum: ["MCQ", "TrueFalse", "ShortAnswer"],
        },
        qId: {
          type: String,
          required: true,
        },
        qDesc: {
          type: String,
          required: true,
        },
        choices: [
          {
            type: String,
            required: true,
          }
        ],
        correctAns: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index for faster queries
examQuestionSchema.index({ category: 1, course: 1, video: 1 }, { unique: true });

const ExamQuestion =
  mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", examQuestionSchema);

export default ExamQuestion;

