import mongoose from 'mongoose';
import User from './models/userSchema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL, { dbName: 'userDB' });
    console.log('✓ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ userid: 'test123' });
    if (existingUser) {
      console.log('User test123 already exists');
      console.log('User details:', {
        userid: existingUser.userid,
        email: existingUser.email,
        name: existingUser.name
      });
      process.exit(0);
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newUser = await User.create({
      userid: 'test123',
      password: hashedPassword,
      name: 'Test User',
      rollno: 'TEST001',
      courseName: 'CSE',
      email: 'test@example.com',
      role: 'student'
    });

    console.log('✓ Test user created successfully!');
    console.log('User details:', {
      userid: newUser.userid,
      email: newUser.email,
      name: newUser.name,
      rollno: newUser.rollno,
      courseName: newUser.courseName
    });
    
    console.log('\nYou can now login with:');
    console.log('User ID: test123');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    process.exit(1);
  }
}

createTestUser();