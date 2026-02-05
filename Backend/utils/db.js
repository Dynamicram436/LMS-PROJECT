import mongoose from "mongoose";

let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 10;

const connectDB = async (retryCount = 0, maxRetries = 3) => {
  try {
    const uri = process.env.MONGODB_URL;

    if (!uri) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    console.log(`📡 Attempting to connect to MongoDB... (Attempt ${retryCount + 1}/${maxRetries + 1})`);

    // Enhanced connection options for reliability
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryReads: true,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    await mongoose.connect(uri, options);
    
    console.log("✅ Connected to MongoDB successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Reset connection attempts counter on successful connection
    connectionAttempts = 0;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
      // Try to reconnect automatically
      setTimeout(() => {
        if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
          connectionAttempts++;
          connectDB();
        }
      }, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully');
      connectionAttempts = 0;
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB (Attempt ${retryCount + 1}):`, error.message);
    
    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`⏳ Retrying in 3 seconds... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB(retryCount + 1, maxRetries);
    }
    
    console.error("🔍 Database connection failed. Application will start in limited mode.");
    console.error("💡 Features requiring database will be temporarily unavailable.");
    return false;
  }
};

// Export additional utilities
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1; // 1 means connected
};

export const getDatabaseStatus = () => {
  const statusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  return {
    status: statusMap[mongoose.connection.readyState] || 'Unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

export default connectDB;
