// Simple test to validate that the User model accepts documents without courseName
import User from './models/userSchema.js';

// Create a sample user without courseName to test the schema
const testUser = new User({
  name: 'Test User',
  userid: 'testuser123',
  password: 'hashedpassword',
  rollno: 'TEST001',
  // No courseName provided
  role: 'student'
});

// Validate the user document
testUser.validate()
  .then(() => {
    console.log('✅ Validation passed! User can be created without courseName');
    console.log('User object:', JSON.stringify(testUser.toObject(), null, 2));
  })
  .catch((error) => {
    console.log('❌ Validation failed:', error.message);
    console.log('Errors:', error.errors);
  });