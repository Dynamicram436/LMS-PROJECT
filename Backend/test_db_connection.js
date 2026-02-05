import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('MONGO_URL:', process.env.MONGO_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Mask credentials
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log('✅ Database connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Test saving a temporary document
    console.log('\n📝 Testing database write operation...');
    
    // Create a simple test collection and document
    const testCollection = mongoose.connection.db.collection('connection_test');
    const testData = { 
      test: 'connection', 
      timestamp: new Date(),
      message: 'Database write test'
    };
    
    const result = await testCollection.insertOne(testData);
    console.log('✅ Write test successful! Inserted document with ID:', result.insertedId);
    
    // Read the document back
    const foundDoc = await testCollection.findOne({ _id: result.insertedId });
    console.log('✅ Read test successful! Retrieved document:', foundDoc);
    
    // Clean up - delete the test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Cleanup successful! Test document deleted.');
    
    console.log('\n🎉 Database connection is working perfectly!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('🔒 Database connection closed.');
  }
}

testDatabaseConnection();