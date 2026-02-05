import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');

const connectionString = process.env.MONGO_URL;
console.log('Connection string:', connectionString);

// Test the connection
try {
  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  });
  console.log('Connected to MongoDB successfully!');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error name:', error.name);
}