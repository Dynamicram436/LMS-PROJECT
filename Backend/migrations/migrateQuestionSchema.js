import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "../models/examQuestionSchema.js";
import Course from "../models/courseSchema.js";

dotenv.config();

async function migrateQuestionSchema() {
  try {
    console.log("Starting migration...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Migrate ExamQuestion collection
    console.log("\n--- Migrating ExamQuestion collection ---");
    const examQuestions = await ExamQuestion.find({});
    console.log(`Found ${examQuestions.length} exam question documents`);

    for (const doc of examQuestions) {
      const updatedQuestions = doc.questions.map((q) => ({
        qType: "MCQ", // Default type
        qId: `Q${doc.questions.indexOf(q) + 1}`,
        qDesc: q.question,
        choices: q.options,
        correctAns: q.options[q.correctAnswer],
      }));

      // Update the document with new structure
      doc.course = doc.course || "General";
      doc.video = doc.video || `V${doc.chapterId || 1}`;
      doc.questions = updatedQuestions;
      
      // Remove old fields if they exist
      if (doc.chapterId) doc.chapterId = undefined;
      if (doc.chapterName) doc.chapterName = undefined;

      await doc.save();
    }
    console.log(`✓ Migrated ${examQuestions.length} exam question documents`);

    // Migrate Course collection embedded questions
    console.log("\n--- Migrating Course collection ---");
    const courses = await Course.find({});
    console.log(`Found ${courses.length} course documents`);

    for (const course of courses) {
      if (course.exam && course.exam.questions) {
        course.exam.questions = course.exam.questions.map((q) => ({
          qType: "MCQ", // Default type
          qId: `Q${course.exam.questions.indexOf(q) + 1}`,
          qDesc: q.question,
          choices: q.options,
          correctAns: q.options[q.correctAnswer],
        }));
        await course.save();
      }
    }
    console.log(`✓ Migrated ${courses.length} course documents`);

    console.log("\n✓ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateQuestionSchema();
