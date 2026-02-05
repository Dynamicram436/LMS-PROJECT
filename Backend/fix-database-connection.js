import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Database Connection Fix Script');
console.log('==================================');

const connectionString = process.env.MONGO_URL;
console.log('Current connection string:', connectionString);

// Check if the placeholder is still present
if (connectionString.includes('<YOUR_ACTUAL_PASSWORD_HERE>')) {
  console.log('\n❌ ERROR: You still need to replace <YOUR_ACTUAL_PASSWORD_HERE> with your actual MongoDB Atlas password');
  console.log('\nSteps to fix:');
  console.log('1. Go to MongoDB Atlas dashboard');
  console.log('2. Navigate to Database Access -> Database Users');
  console.log('3. Find the user "bhargavramgomatham_db_user"');
  console.log('4. Copy the correct password');
  console.log('5. Replace <YOUR_ACTUAL_PASSWORD_HERE> in the .env file with the actual password');
  console.log('6. Make sure to properly escape any special characters in the password');
  console.log('\nExample format:');
  console.log('MONGO_URL="mongodb+srv://bhargavramgomatham_db_user:ACTUAL_PASSWORD_HERE@cluster0.lc2qwz1.mongodb.net/usersDB?retryWrites=true&w=majority"');
  process.exit(1);
}

console.log('\n📡 Testing MongoDB connection...');

// Test the connection with enhanced error handling
try {
  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  
  console.log('✅ Successfully connected to MongoDB!');
  console.log('📊 Database name:', mongoose.connection.name);
  console.log('🔗 Host:', mongoose.connection.host);
  
  // Test database operations
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('📋 Collections in database:', collections.map(c => c.name));
  
  await mongoose.disconnect();
  console.log('\n✅ Connection test completed successfully!');
  
} catch (error) {
  console.error('\n❌ MongoDB connection failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error name:', error.name);
  
  // Provide specific troubleshooting advice based on error
  if (error.message.includes('Authentication failed')) {
    console.log('\n🔧 AUTHENTICATION TROUBLESHOOTING:');
    console.log('   - Verify the username and password are correct');
    console.log('   - Check if the password contains special characters that need URL encoding');
    console.log('   - Ensure the database user has proper permissions');
  } else if (error.message.includes('getaddrinfo ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
    console.log('\n🔧 NETWORK TROUBLESHOOTING:');
    console.log('   - Verify the cluster URL is correct');
    console.log('   - Check if your IP address is whitelisted in MongoDB Atlas (Network Access)');
    console.log('   - Ensure you have internet connectivity');
    console.log('   - Check firewall settings');
  } else if (error.message.includes('failed to connect to server')) {
    console.log('\n🔧 CONNECTION TROUBLESHOOTING:');
    console.log('   - Verify MongoDB Atlas cluster is active and not paused');
    console.log('   - Check if the cluster region is accessible from your location');
  }
  
  process.exit(1);
}