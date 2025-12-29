import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Connection string used:', process.env.MONGO_URL.replace(/:[^:]*@/, ':*****@'));
    process.exit(1);
  }
};

export default connectDB;
