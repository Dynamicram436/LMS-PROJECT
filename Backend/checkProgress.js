import { connectDB } from './utils/db.js';
import User from './models/userSchema.js';

const checkUserProgress = async () => {
  try {
    await connectDB();
    console.log('Database connected');
    
    // Find a test user
    const user = await User.findOne({ userid: 'test123' });
    if (user) {
      console.log('User found:', user.userid);
      console.log('Course Progress:');
      console.log(JSON.stringify(user.courseProgress, null, 2));
    } else {
      console.log('No user found with userid: test123');
      
      // Try to find any user
      const anyUser = await User.findOne();
      if (anyUser) {
        console.log('Found user with ID:', anyUser.userid);
        console.log('Course Progress:');
        console.log(JSON.stringify(anyUser.courseProgress, null, 2));
      } else {
        console.log('No users found in database');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

checkUserProgress();