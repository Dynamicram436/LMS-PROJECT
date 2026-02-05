import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testLoginEndpoint() {
  console.log('Testing login endpoint...');
  
  try {
    // Test with empty credentials (should return 400)
    const response1 = await axios.post(`${BASE_URL}/auth/login`, {});
    console.log('Empty credentials response:', response1.status, response1.data);
  } catch (error) {
    if (error.response) {
      console.log('Empty credentials error:', error.response.status, error.response.data);
    } else {
      console.log('Network error for empty credentials:', error.message);
    }
  }

  try {
    // Test with invalid credentials (should return 404 or 400)
    const response2 = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    });
    console.log('Invalid credentials response:', response2.status, response2.data);
  } catch (error) {
    if (error.response) {
      console.log('Invalid credentials error:', error.response.status, error.response.data);
    } else {
      console.log('Network error for invalid credentials:', error.message);
    }
  }

  console.log('Login endpoint test completed.');
}

testLoginEndpoint();