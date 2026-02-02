import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedCourses from './seedCourses.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/edutrack');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    const result = await seedCourses();
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed();
