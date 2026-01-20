import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";

dotenv.config();

const sampleQuestions = {
  Mathematics: [
    {
      chapterId: 1,
      category: "Mathematics",
      chapterName: "Basic Arithmetic",
      questions: [
        {
          question: "What is 15 + 27?",
          options: ["40", "42", "44", "46"],
          correctAnswer: 1
        },
        {
          question: "What is 8 × 7?",
          options: ["54", "56", "58", "60"],
          correctAnswer: 1
        },
        {
          question: "What is 144 ÷ 12?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2
        },
        {
          question: "What is the square root of 81?",
          options: ["7", "8", "9", "10"],
          correctAnswer: 2
        },
        {
          question: "What is 25% of 200?",
          options: ["40", "50", "60", "70"],
          correctAnswer: 1
        }
      ]
    },
    {
      chapterId: 2,
      category: "Mathematics", 
      chapterName: "Algebra Basics",
      questions: [
        {
          question: "If x + 5 = 12, what is x?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2
        },
        {
          question: "What is 2x + 3 = 11, solve for x?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1
        },
        {
          question: "Simplify: 3x + 2x",
          options: ["5x", "6x", "x", "2x"],
          correctAnswer: 0
        },
        {
          question: "What is x² when x = 4?",
          options: ["8", "12", "16", "20"],
          correctAnswer: 2
        },
        {
          question: "If 3x = 21, what is x?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2
        }
      ]
    }
  ],
  Science: [
    {
      chapterId: 1,
      category: "Science",
      chapterName: "Physics Basics",
      questions: [
        {
          question: "What is the unit of force?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correctAnswer: 1
        },
        {
          question: "What is the speed of light?",
          options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
          correctAnswer: 0
        },
        {
          question: "What is Newton's first law of motion?",
          options: ["F = ma", "Action equals reaction", "Object in motion stays in motion", "Energy cannot be created"],
          correctAnswer: 2
        },
        {
          question: "What is the unit of power?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correctAnswer: 2
        },
        {
          question: "What is gravity on Earth?",
          options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
          correctAnswer: 1
        }
      ]
    },
    {
      chapterId: 2,
      category: "Science",
      chapterName: "Chemistry Basics",
      questions: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "O2", "N2"],
          correctAnswer: 0
        },
        {
          question: "What is the atomic number of Carbon?",
          options: ["4", "6", "8", "12"],
          correctAnswer: 1
        },
        {
          question: "What is the chemical formula for carbon dioxide?",
          options: ["CO", "CO2", "C2O", "C2O2"],
          correctAnswer: 1
        },
        {
          question: "What is the pH of pure water?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswer: 2
        }
      ]
    }
  ],
  English: [
    {
      chapterId: 1,
      category: "English",
      chapterName: "Grammar Basics",
      questions: [
        {
          question: "Which is the correct form: 'He ___ to school yesterday'?",
          options: ["go", "goes", "went", "gone"],
          correctAnswer: 2
        },
        {
          question: "What is the plural of 'child'?",
          options: ["childs", "children", "childrens", "childes"],
          correctAnswer: 1
        },
        {
          question: "Which sentence is correct?",
          options: ["She don't like apples", "She doesn't like apples", "She doesn't likes apples", "She don't likes apples"],
          correctAnswer: 1
        },
        {
          question: "What is the past tense of 'write'?",
          options: ["writed", "wrote", "written", "writing"],
          correctAnswer: 1
        },
        {
          question: "Which is a noun?",
          options: ["run", "quickly", "book", "beautiful"],
          correctAnswer: 2
        }
      ]
    }
  ]
};

// Create a simple API endpoint to seed data
const seedQuestions = async (req, res) => {
  try {
    // Clear existing exam questions
    await ExamQuestion.deleteMany({});
    console.log("Cleared existing exam questions");

    // Insert sample questions
    const allQuestions = [];
    Object.values(sampleQuestions).forEach(categoryQuestions => {
      allQuestions.push(...categoryQuestions);
    });

    await ExamQuestion.insertMany(allQuestions);
    console.log(`Inserted ${allQuestions.length} question sets`);

    return {
      success: true,
      message: `Successfully seeded ${allQuestions.length} question sets`,
      data: {
        categories: Object.keys(sampleQuestions),
        totalQuestions: allQuestions.reduce((acc, q) => acc + q.questions.length, 0)
      }
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Error seeding database",
      error: error.message
    };
  }
};

export { seedQuestions };
