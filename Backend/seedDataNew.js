import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";

dotenv.config();

const sampleQuestions = [
  {
    category: "CSE",
    course: "B.Tech",
    video: "CSE-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What does HTML stand for?",
        choices: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Tabular Main Log", "None"],
        correctAns: "Hyper Text Markup Language"
      },
      {
        qType: "MCQ",
        qId: "Q2",
        qDesc: "Which data structure uses LIFO?",
        choices: ["Queue", "Stack", "Linked List", "Tree"],
        correctAns: "Stack"
      }
    ]
  },
  {
    category: "ECE",
    course: "B.Tech",
    video: "ECE-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the full form of VLSI?",
        choices: ["Very Large Scale Integration", "Velocity Level System Index", "Variable Low Signal Interface", "None"],
        correctAns: "Very Large Scale Integration"
      }
    ]
  },
  {
    category: "Mechanical",
    course: "B.Tech",
    video: "MECH-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the unit of Force?",
        choices: ["Watt", "Newton", "Joule", "Pascal"],
        correctAns: "Newton"
      }
    ]
  },
  {
    category: "Civil",
    course: "B.Tech",
    video: "CIVIL-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the standard size of a brick?",
        choices: ["19cm x 9cm x 9cm", "20cm x 10cm x 10cm", "15cm x 5cm x 5cm", "None"],
        correctAns: "19cm x 9cm x 9cm"
      }
    ]
  },
  {
    category: "EEE",
    course: "B.Tech",
    video: "EEE-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "Which law relates voltage, current and resistance?",
        choices: ["Newton's Law", "Ohm's Law", "Faraday's Law", "Kirchhoff's Law"],
        correctAns: "Ohm's Law"
      }
    ]
  },
  {
    category: "Diploma",
    course: "Polytechnic",
    video: "DIP-V1",
    questions: [
      {
        qType: "MCQ",
        qId: "Q1",
        qDesc: "What is the full form of ITI?",
        choices: ["Industrial Training Institute", "Indian Technical Institute", "International Tech Index", "None"],
        correctAns: "Industrial Training Institute"
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
