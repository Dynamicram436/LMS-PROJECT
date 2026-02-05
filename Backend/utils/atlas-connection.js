import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;

    if (!uri) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    console.log('📡 Connecting to MongoDB Atlas...');
    console.log('🔗 Connection string:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    // MongoDB Atlas connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    await mongoose.connect(uri, options);
    
    console.log("✅ Connected to MongoDB Atlas successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Test the connection by listing collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Check if users collection exists and count documents
    if (collections.some(c => c.name === 'users')) {
      const userCount = await db.collection('users').countDocuments();
      console.log(`👥 Users collection has ${userCount} documents`);
    } else {
      console.log('📝 Users collection will be created on first registration');
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.error('🔍 Error details:', error);
    
    // Don't fall back to in-memory - we want to fix the actual connection
    console.log('💡 Please check:');
    console.log('   1. Your MongoDB Atlas cluster is running');
    console.log('   2. Network access is configured (IP whitelist)');
    console.log('   3. Database user credentials are correct');
    console.log('   4. Connection string format is correct');
    
    return false;
  }
};

export default connectDB;
