import mongoose from 'mongoose';
import User from './models/userSchema.js';

const checkUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/skilltrack');
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log('Existing users:');
    users.forEach(user => {
      console.log(`- ID: ${user.userid}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUsers();
