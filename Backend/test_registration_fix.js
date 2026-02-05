import axios from 'axios';

async function testRegistration() {
  try {
    console.log('🧪 Testing Registration with Fixed Database Connection');
    console.log('==================================================');

    // Generate unique test data
    const timestamp = Date.now();
    const userData = {
      name: `Test Student ${timestamp}`,
      userid: `testuser${timestamp}`,
      password: 'testpassword123',
      rollno: `TEST${timestamp}`,
      courseName: 'Computer Science',
      email: `test${timestamp}@example.com`
    };

    console.log('\n📝 Sending registration request...');
    console.log('User data:', userData);

    const response = await axios.post('http://localhost:5000/auth/register', userData);
    
    console.log('✅ Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    // Now let's try to login to verify the user was created in the database
    console.log('\n🔑 Testing login with registered user...');
    
    const loginResponse = await axios.post('http://localhost:5000/auth/login', {
      email: userData.userid, // Using userid for login
      password: userData.password
    });
    
    console.log('✅ Login successful!');
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', JSON.stringify(loginResponse.data, null, 2));

    console.log('\n🎉 Registration and login test completed successfully!');
    console.log('✅ Users are being saved to MongoDB database as expected.');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('General error:', error.message);
    }
  }
}

testRegistration();