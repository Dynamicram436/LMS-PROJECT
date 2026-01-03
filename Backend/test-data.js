import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Import models
import User from './models/userSchema.js';
import ExamQuestion from './models/examQuestionSchema.js';

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Check users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- User ID: ${user.userid}, Email: ${user.email}`);
      
      // Check course progress
      user.courseProgress.forEach((progress, index) => {
        console.log(`  Course ${index}: ${progress.courseId}, Attempts: ${progress.exam?.attempts || 0}`);
        
        if (progress.examAttempts && progress.examAttempts.length > 0) {
          console.log(`    First attempt answers:`, progress.examAttempts[0].answers?.slice(0, 2));
        }
      });
    });

    // Check exam questions
    const examQuestions = await ExamQuestion.find({});
    console.log(`\nFound ${examQuestions.length} exam question sets:`);
    examQuestions.forEach(eq => {
      console.log(`- ${eq.category} Chapter ${eq.chapterId}: ${eq.chapterName}`);
      console.log(`  Questions: ${eq.questions?.length || 0}`);
      if (eq.questions && eq.questions.length > 0) {
        console.log(`  First question:`, eq.questions[0]);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();
