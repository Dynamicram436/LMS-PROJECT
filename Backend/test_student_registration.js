import axios from 'axios';

// Test the registration endpoint without email
async function testRegistrationWithoutEmail() {
  try {
    console.log('Testing student registration without email...');

    const userData = {
      name: 'Test Student No Email',
      userid: 'teststudent_no_email',
      password: 'securepassword123',
      rollno: 'STU002',
      courseName: 'Computer Science'
    };

    const response = await axios.post('http://localhost:5000/auth/register', userData);

    console.log('Registration without email successful!');
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

// Test the registration endpoint with email
async function testRegistrationWithEmail() {
  try {
    console.log('\nTesting student registration with email...');

    const userData = {
      name: 'Test Student With Email',
      email: 'testwithemail@example.com',
      userid: 'teststudent_with_email',
      password: 'securepassword123',
      rollno: 'STU003',
      courseName: 'Computer Science'
    };

    const response = await axios.post('http://localhost:5000/auth/register', userData);

    console.log('Registration with email successful!');
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

console.log('Running tests...');
testRegistrationWithoutEmail();
testRegistrationWithEmail();