const axios = require('axios');

// Test script to verify the video progress endpoint is working
async function testVideoProgress() {
  try {
    console.log('Testing video progress endpoint...');
    
    // Replace with actual values from your application
    const testData = {
      userId: 'test_user_id', // Replace with an actual user ID from your DB
      courseId: 'CSE',        // Replace with an actual course ID
      videoId: 'test_video_1', // Replace with an actual video ID
      isCompleted: true,
      progressPercentage: 50
    };
    
    const response = await axios.post('http://localhost:8000/api/exam/video-progress', testData);
    
    console.log('Success response:', response.data);
    console.log('Test passed!');
  } catch (error) {
    console.error('Error response:', error.response?.data || error.message);
    console.log('Test failed!');
  }
}

testVideoProgress();