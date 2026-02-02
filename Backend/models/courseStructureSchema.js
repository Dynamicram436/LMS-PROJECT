import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true, // 1 or 2
    },
    subjects: [{
        type: String,
        required: true
    }]
});

const yearSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true, // 1, 2, 3, 4
    },
    semesters: [semesterSchema]
});

const courseStructureSchema = new mongoose.Schema({
    branch: {
        type: String, // e.g., "CSE", "ECE"
        required: true,
        unique: true
    },
    years: [yearSchema]
}, { timestamps: true });

const CourseStructure = mongoose.models.CourseStructure || mongoose.model("CourseStructure", courseStructureSchema);

export default CourseStructure;
