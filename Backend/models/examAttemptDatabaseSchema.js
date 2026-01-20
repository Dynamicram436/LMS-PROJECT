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
      required: true,
      enum: ["English", "Telugu", "Hindi", "Mathematics", "Science", "Social Studies"]
    },
    chapterName: {
      type: String,
      required: true
    },
    questions: [{
      question: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true,
        validate: {
          validator: function(options) {
            return options.length >= 2;
          },
          message: 'Question must have at least 2 options'
        }
      },
      correctAnswer: {
        type: Number,
        required: true,
        validate: {
          validator: function(correctAnswer) {
            return correctAnswer >= 0 && correctAnswer < this.options.length;
          },
          message: 'Correct answer must be a valid option index'
        }
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Expires after 24 hours
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for faster queries
examAttemptDatabaseSchema.index({ userId: 1, courseId: 1 });
examAttemptDatabaseSchema.index({ chapterId: 1, category: 1 });
examAttemptDatabaseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ExamAttemptDatabase = mongoose.models.ExamAttemptDatabase || mongoose.model("ExamAttemptDatabase", examAttemptDatabaseSchema);

export default ExamAttemptDatabase;
