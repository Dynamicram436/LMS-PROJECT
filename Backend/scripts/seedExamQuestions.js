import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import ExamQuestion from "../models/examQuestionSchema.js";
import { chaptersData } from "../../frontend/myproject/src/Courses/courseCatalog.js";

dotenv.config();

const seedExamQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing questions
    try {
      await ExamQuestion.collection.drop();
      console.log("Dropped existing exam questions collection");
    } catch (dropError) {
      if (dropError.code === 26) {
        console.log("Collection does not exist, skipping drop");
      } else {
        console.error("Error dropping collection:", dropError.message);
      }
    }

    // Explicitly create indexes to be sure
    await ExamQuestion.createIndexes();
    console.log("Created indexes");

    // Insert questions
    let inserted = 0;
    let skipped = 0;
    let errorCount = 0;

    for (const chapter of chaptersData) {
      console.log(`Processing: ${chapter.category} - ${chapter.name} (ID: ${chapter.id})`);
      if (chapter.examQuestions && chapter.examQuestions.length > 0) {
        try {
          // Use upsert to avoid duplicates
          await ExamQuestion.findOneAndUpdate(
            { chapterId: chapter.id, category: chapter.category },
            {
              chapterId: chapter.id,
              category: chapter.category,
              chapterName: chapter.name,
              questions: chapter.examQuestions,
            },
            { upsert: true, new: true, runValidators: true }
          );
          inserted++;
          console.log(
            `✓ Inserted/Updated: ${chapter.category} - ${chapter.name}`
          );
        } catch (error) {
          if (error.code === 11000) {
            skipped++;
            console.log(
              `⊘ Skipped (duplicate): ${chapter.category} - ${chapter.name}. Error: ${error.errmsg || error.message}`
            );
          } else {
            errorCount++;
            console.error(`✗ Error inserting ${chapter.name}:`, error);
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
