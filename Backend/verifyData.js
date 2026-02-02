
import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";
import CourseStructure from "./models/courseStructureSchema.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const verify = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/";
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");

        const structureCount = await CourseStructure.countDocuments();
        console.log(`Course Structures: ${structureCount}`);

        const questionCount = await ExamQuestion.countDocuments();
        console.log(`Total Exam Question Sets: ${questionCount}`);

        const questionDetails = await ExamQuestion.find({}, { category: 1, year: 1, semester: 1, subject: 1 });

        console.log("\nQuestion Sets Breakdown:");
        questionDetails.forEach(q => {
            console.log(`- ${q.category} Year ${q.year} Sem ${q.semester}: ${q.subject}`);
        });

        if (questionCount > 0 && structureCount > 0) {
            console.log("\nVERIFICATION PASSED: Data exists.");
        } else {
            console.log("\nVERIFICATION FAILED: Missing data.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Verification Error:", error);
        process.exit(1);
    }
};

verify();
