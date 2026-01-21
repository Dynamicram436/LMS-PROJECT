import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";

dotenv.config();

const sampleQuestions = [
  {
    category: "English",
    course: "CE",
    video: "V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the synonym of 'Happy'?",
        choices: ["Joyful", "Sad", "Angry", "Tired"],
        correctAns: "Joyful"
      },
      {
        qType: "MCQ",
        qId: "Q2",
        qDesc: "Which word is the opposite of 'Dark'?",
        choices: ["Light", "Black", "Night", "Shadow"],
        correctAns: "Light"
      },
      {
        qType: "MCQ",
        qId: "Q3",
        qDesc: "What is the plural of 'Child'?",
        choices: ["Childs", "Children", "Childes", "Childern"],
        correctAns: "Children"
      }
    ]
  },
  {
    category: "Mathematics",
    course: "CE",
    video: "V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is 2 + 2?",
        choices: ["3", "4", "5", "6"],
        correctAns: "4"
      },
      {
        qType: "MCQ",
        qId: "Q2",
        qDesc: "What is the square root of 16?",
        choices: ["2", "3", "4", "5"],
        correctAns: "4"
      },
      {
        qType: "MCQ",
        qId: "Q3",
        qDesc: "What is 10 × 5?",
        choices: ["45", "50", "55", "60"],
        correctAns: "50"
      }
    ]
  },
  {
    category: "Science",
    course: "CE",
    video: "V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the chemical symbol for Gold?",
        choices: ["Go", "Gd", "Au", "Ag"],
        correctAns: "Au"
      },
      {
        qType: "MCQ",
        qId: "Q2",
        qDesc: "What is the speed of light?",
        choices: ["3 × 10^8 m/s", "3 × 10^7 m/s", "3 × 10^6 m/s", "3 × 10^9 m/s"],
        correctAns: "3 × 10^8 m/s"
      },
      {
        qType: "MCQ",
        qId: "Q3",
        qDesc: "How many bones are in the human body?",
        choices: ["186", "206", "226", "246"],
        correctAns: "206"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    console.log("\nClearing existing exam questions...");
    await ExamQuestion.deleteMany({});
    console.log("✓ Cleared existing data");

    // Insert new data
    console.log("\nInserting sample questions...");
    const result = await ExamQuestion.insertMany(sampleQuestions);
    console.log(`✓ Successfully inserted ${result.length} question sets`);

    // Display inserted data
    console.log("\n--- Inserted Data ---");
    result.forEach((doc) => {
      console.log(`\nCategory: ${doc.category}`);
      console.log(`Course: ${doc.course}`);
      console.log(`Video: ${doc.video}`);
      console.log(`Questions: ${doc.questions.length}`);
      doc.questions.forEach((q) => {
        console.log(`  - ${q.qId}: ${q.qDesc} (Type: ${q.qType})`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();
