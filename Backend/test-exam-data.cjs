const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/userSchema.js");

// Connect to MongoDB
const mongoURI =
  process.env.MONGODB_URL ||
  "mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Check if test user exists
      const existingUser = await User.findOne({ userid: "test123" });

      if (!existingUser) {
        // Create test user with exam data
        const testUser = new User({
          userid: "test123",
          password: "password123",
          name: "Test User",
          rollno: "TEST001",
          courseProgress: [
            {
              courseId: "Mathematics",
              exam: {
                score: 85,
                passed: true,
                attempts: 2,
                lastAttempt: new Date(),
                answers: [
                  {
                    questionIndex: 0,
                    selectedOption: 1,
                    isCorrect: true,
                  },
                  {
                    questionIndex: 1,
                    selectedOption: 0,
                    isCorrect: false,
                  },
                ],
              },
              examAttempts: [
                {
                  score: 85,
                  passed: true,
                  attemptNumber: 1,
                  attemptDate: new Date(),
                  answers: [
                    {
                      questionIndex: 0,
                      selectedOption: 1,
                      isCorrect: true,
                    },
                    {
                      questionIndex: 1,
                      selectedOption: 0,
                      isCorrect: false,
                    },
                  ],
                },
                {
                  score: 90,
                  passed: true,
                  attemptNumber: 2,
                  attemptDate: new Date(Date.now() - 86400000), // 1 day ago
                  answers: [
                    {
                      questionIndex: 0,
                      selectedOption: 1,
                      isCorrect: true,
                    },
                    {
                      questionIndex: 1,
                      selectedOption: 1,
                      isCorrect: true,
                    },
                  ],
                },
              ],
              completionPercentage: 75,
            },
            {
              courseId: "Science",
              exam: {
                score: 72,
                passed: true,
                attempts: 1,
                lastAttempt: new Date(),
                answers: [
                  {
                    questionIndex: 0,
                    selectedOption: 2,
                    isCorrect: true,
                  },
                  {
                    questionIndex: 1,
                    selectedOption: 0,
                    isCorrect: false,
                  },
                ],
              },
              examAttempts: [
                {
                  score: 72,
                  passed: true,
                  attemptNumber: 1,
                  attemptDate: new Date(),
                  answers: [
                    {
                      questionIndex: 0,
                      selectedOption: 2,
                      isCorrect: true,
                    },
                    {
                      questionIndex: 1,
                      selectedOption: 0,
                      isCorrect: false,
                    },
                  ],
                },
              ],
              completionPercentage: 60,
            },
          ],
        });

        await testUser.save();
        console.log("Test user created successfully");
      } else {
        console.log("Test user already exists");
        console.log("Course progress:", existingUser.courseProgress);
      }

      // Test the API response
      const userData = await User.findOne({ userid: "test123" });
      const examResults = userData.courseProgress
        .filter((progress) => progress.exam?.attempts > 0)
        .map((progress) => ({
          courseId: progress.courseId,
          courseName: progress.courseId,
          score: progress.exam.score,
          passed: progress.exam.passed,
          attempts: progress.exam.attempts,
          lastAttempt: progress.exam.lastAttempt,
          completionPercentage: progress.completionPercentage,
          answers: progress.exam.answers || [],
          examAttempts: progress.examAttempts || [],
        }));

      console.log(
        "Exam results that would be returned:",
        JSON.stringify(examResults, null, 2),
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(console.error);
