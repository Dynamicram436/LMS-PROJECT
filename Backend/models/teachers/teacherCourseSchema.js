import mongoose from 'mongoose';

const teacherCourseSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  academicYear: {
    type: String,
    trim: true
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalStudents: {
    type: Number,
    default: 0
  },
  assignmentsCount: {
    type: Number,
    default: 0
  },
  resourcesCount: {
    type: Number,
    default: 0
  },
  lecturesCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  courseProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes
teacherCourseSchema.index({ teacherId: 1 });
teacherCourseSchema.index({ courseId: 1 });
teacherCourseSchema.index({ subject: 1 });
teacherCourseSchema.index({ academicYear: 1 });
teacherCourseSchema.index({ status: 1 });

// Update the updatedAt field before saving
teacherCourseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const TeacherCourse = mongoose.models.TeacherCourse || mongoose.model('TeacherCourse', teacherCourseSchema);

export default TeacherCourse;