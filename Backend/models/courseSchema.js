import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  }
});

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true
    },
    courseCategory: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'MBA', 'Diploma']
    },
    courseDescription: {
      type: String,
      required: true
    },
    courseDuration: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    videos: [videoSchema],
    exam: {
      questions: [questionSchema],
      passingScore: {
        type: Number,
        default: 70
      },
      timeLimit: {
        type: Number, // in minutes
        default: 30
      }
    }
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
