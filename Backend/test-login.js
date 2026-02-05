import bcrypt from 'bcryptjs';
import User from './models/userSchema.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Test data to check if login logic works
    const testUserId = "testuser123";
    const testEmail = "test@example.com";
    const testPassword = "password123";
    
    // Create a hashed password for testing
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Try to find user by userid first
    console.log("Testing login with userid...");
    let userByUserid = await User.findOne({ userid: testUserId });
    console.log("Found user by userid:", userByUserid ? userByUserid.userid : "Not found");
    
    // Try to find user by email
    console.log("Testing login with email...");
    let userByEmail = await User.findOne({ email: testEmail });
    console.log("Found user by email:", userByEmail ? userByEmail.email : "Not found");
    
    // Test the logic that was updated in the controller
    let user;
    const loginInput = testUserId; // Simulate what comes from frontend
    
    if (loginInput && loginInput.includes('@')) {
        // If the input contains @, treat it as an email
        user = await User.findOne({ email: loginInput });
        console.log("Searching by email:", loginInput);
    } else {
        // Otherwise, treat it as a userid
        user = await User.findOne({ userid: loginInput });
        console.log("Searching by userid:", loginInput);
    }
    
    console.log("Final user found:", user ? { id: user._id, userid: user.userid, email: user.email, name: user.name } : "Not found");
    
    mongoose.connection.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));