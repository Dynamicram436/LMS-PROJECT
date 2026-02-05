import { registerStudent } from './controllers/authControllers.js';

// Test with missing fields
const mockReq = {
  body: {
    name: 'Test User',
    email: 'test@example.com',
    // Missing userid, password, and rollno
  }
};

let responseSent = false;
const mockRes = {
  status: function(code) {
    console.log('Status:', code);
    return this;
  },
  json: function(data) {
    console.log('Response:', JSON.stringify(data, null, 2));
    responseSent = true;
    return this;
  }
};

console.log('Testing registration with missing fields...');
try {
  registerStudent(mockReq, mockRes).then(() => {
    console.log('Function completed');
  }).catch(err => {
    console.log('Promise error:', err.message);
  });
} catch (e) {
  console.log('Sync error:', e.message);
}