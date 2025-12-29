import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "../models/examQuestionSchema.js";
import { chaptersData } from "../../frontend/myproject/src/Courses/courseCatalog.js";

dotenv.config();

const seedExamQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing questions (optional - comment out if you want to keep existing data)
    // await ExamQuestion.deleteMany({});
    // console.log("Cleared existing exam questions");

    // Insert questions
    let inserted = 0;
    let skipped = 0;

    for (const chapter of chaptersData) {
      if (chapter.examQuestions && chapter.examQuestions.length > 0) {
        try {
          // Use upsert to avoid duplicates
          const result = await ExamQuestion.findOneAndUpdate(
            { chapterId: chapter.id, category: chapter.category },
            {
              chapterId: chapter.id,
              category: chapter.category,
              chapterName: chapter.name,
              questions: chapter.examQuestions,
            },
            { upsert: true, new: true }
          );
          inserted++;
          console.log(
            `✓ Inserted/Updated: ${chapter.category} - ${chapter.name}`
          );
        } catch (error) {
          if (error.code === 11000) {
            skipped++;
            console.log(
              `⊘ Skipped (duplicate): ${chapter.category} - ${chapter.name}`
            );
          } else {
            console.error(`✗ Error inserting ${chapter.name}:`, error.message);
          }
        }
      }
    }

    console.log("\n=== Seeding Complete ===");
    console.log(`Inserted/Updated: ${inserted}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total: ${inserted + skipped}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding exam questions:", error);
    process.exit(1);
  }
};

seedExamQuestions();
