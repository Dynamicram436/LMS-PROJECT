import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "Diploma", "English", "Telugu", "Hindi", "Mathematics", "Science", "Social Studies"],
    },
    course: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    // New fields for hierarchical drill-down
    year: {
      type: Number, // 1, 2, 3, 4
      required: false
    },
    semester: {
      type: Number, // 1, 2
      required: false
    },
    subject: {
      type: String,
      required: false
    },
    // Adding chapterId field to support the new seed data structure
    chapterId: {
      type: Number,
      required: false,
    },
    chapterName: {
      type: String,
      required: false,
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
        explanation: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index for faster queries
examQuestionSchema.index({ category: 1, course: 1, video: 1 }, { unique: true });
// Create compound index for chapterId queries
examQuestionSchema.index({ chapterId: 1, category: 1 }, { unique: false });

const ExamQuestion =
  mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", examQuestionSchema);

export default ExamQuestion;

