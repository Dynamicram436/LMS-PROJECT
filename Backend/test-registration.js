import axios from 'axios';

// Test the registration endpoint
async function testRegistration() {
  try {
    console.log('Testing student registration...');
    
    const userData = {
      name: 'Test Student',
      email: 'teststudent@example.com',
      userid: 'teststudent123',
      password: 'securepassword123',
      rollno: 'STU001'
    };
    
    const response = await axios.post('http://localhost:5000/auth/register', userData);
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Registration failed with status:', error.response.status);
      console.log('Error message:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testRegistration();