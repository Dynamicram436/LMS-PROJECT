import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    console.log("📡 Attempting to connect to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error("🔍 Hint: If you see ECONNREFUSED, check if port 27017 is blocked or if your DNS supports SRV records.");
  }
};

export default connectDB;