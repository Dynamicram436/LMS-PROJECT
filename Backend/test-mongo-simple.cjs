const mongoose = require('mongoose');

// Test simple connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect("mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/usersDB?retryWrites=true&w=majority");
    console.log('✅ Connected successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();