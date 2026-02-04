import mongoose from 'mongoose';

const teacherUploadSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadType: {
    type: String,
    enum: ['lecture_notes', 'assignments', 'syllabus', 'resources', 'videos', 'other'],
    default: 'resources'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  downloads: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  approvedAt: {
    type: Date
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
teacherUploadSchema.index({ teacherId: 1 });
teacherUploadSchema.index({ subject: 1 });
teacherUploadSchema.index({ uploadType: 1 });
teacherUploadSchema.index({ createdAt: -1 });
teacherUploadSchema.index({ course: 1 });

// Update the updatedAt field before saving
teacherUploadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const TeacherUpload = mongoose.models.TeacherUpload || mongoose.model('TeacherUpload', teacherUploadSchema);

export default TeacherUpload;