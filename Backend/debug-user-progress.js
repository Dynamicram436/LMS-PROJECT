import mongoose from 'mongoose';
import User from './models/userSchema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const inspectUserProgress = async () => {
    await connectDB();

    try {
        // You can pass a userId as a command line argument
        const userId = process.argv[2];

        let query = {};
        if (userId) {
            query = { userid: userId };
            console.log(`Searching for user with userid: ${userId}`);
        } else {
            console.log('No userId provided, fetching first user with courseProgress...');
            query = { 'courseProgress.0': { $exists: true } };
        }

        const user = await User.findOne(query);

        if (!user) {
            console.log('User not found or no user has courseProgress.');
            process.exit(0);
        }

        console.log(`Found User: ${user.name} (${user.userid})`);
        console.log('--- Course Progress ---');

        user.courseProgress.forEach((cp, index) => {
            console.log(`\nEntry #${index + 1}:`);
            console.log(`Course ID: ${cp.courseId}`);
            console.log(`Completion Percentage: ${cp.completionPercentage}%`);
            console.log(`Is Completed: ${cp.isCourseCompleted}`);
            console.log(`Videos Count: ${cp.videos.length}`);
            console.log(`Exam Attempts: ${cp.examAttempts?.length || 0}`);
            if (cp.exam) {
                console.log(`Current Exam State: Passed=${cp.exam.passed}, Score=${cp.exam.score}`);
            }
        });

        console.log('\n--- Selected Courses ---');
        console.log(user.selectedCourses);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

inspectUserProgress();
