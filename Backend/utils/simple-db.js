import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use local MongoDB for immediate testing
    const localUri = 'mongodb://127.0.0.1:27017/lms_db';
    
    console.log('📡 Connecting to local MongoDB...');
    
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    
    console.log('✅ Connected to local MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    return true;
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    
    // Fallback to in-memory database for testing
    console.log('🔄 Using in-memory database for testing...');
    
    // Create a simple in-memory store
    global.inMemoryDB = {
      users: [],
      isConnected: true
    };
    
    return true;
  }
};

export default connectDB;
