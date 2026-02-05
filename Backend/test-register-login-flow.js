import axios from 'axios';

async function testRegisterAndLogin() {
  try {
    console.log('🧪 Testing Register and Login Flow (Demo Mode)');
    console.log('==============================================');
    
    // Step 1: Register a new user
    const userData = {
      name: 'Test Student Demo',
      userid: 'demo_student_' + Date.now(),
      password: 'testpassword123',
      rollno: 'DEMO' + Date.now(),
      email: 'demo@example.com'
    };
    
    console.log('\n📝 Step 1: Registering new user...');
    console.log('User data:', userData);
    
    const registerResponse = await axios.post('http://localhost:5000/auth/register', userData);
    console.log('✅ Registration successful!');
    console.log('Registration response:', registerResponse.data);
    
    // Step 2: Login with the same credentials
    console.log('\n🔑 Step 2: Logging in with same credentials...');
    
    const loginData = {
      email: userData.userid, // Using userid as email for login
      password: userData.password
    };
    
    const loginResponse = await axios.post('http://localhost:5000/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('Login response:', loginResponse.data);
    
    console.log('\n🎉 Test completed successfully! Both registration and login work in demo mode.');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Test failed with status:', error.response.status);
      console.log('Error message:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testRegisterAndLogin();