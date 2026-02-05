import axios from 'axios';

// Test the registration endpoint without courseName
async function testRegistrationWithoutCourseName() {
  try {
    console.log('Testing student registration without courseName...');

    const userData = {
      name: 'Test Student No Course',
      userid: 'teststudent_no_course',
      password: 'securepassword123',
      rollno: 'STU004'
      // Note: no courseName field
    };

    const response = await axios.post('http://localhost:5000/auth/register', userData);

    console.log('Registration without courseName successful!');
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

testRegistrationWithoutCourseName();