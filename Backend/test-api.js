const axios = require('axios');

// Test the video progress API endpoint
const testVideoProgress = async () => {
  try {
    console.log('Testing video progress API endpoint...');
    
    const testData = {
      userId: 'test_user_id', // Replace with actual user ID
      courseId: 'test_course', // Replace with actual course ID
      videoId: 'test_video_id', // Replace with actual video ID
      isCompleted: true,
      progressPercentage: null
    };

    console.log('Sending request with data:', testData);

    const response = await axios.post('http://localhost:8000/api/exam/video-progress', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response received:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testVideoProgress();