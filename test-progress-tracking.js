const axios = require('axios');

async function testProgressTracking() {
  try {
    console.log('Testing progress tracking system...\n');
    
    // Test user ID - using test user from database
    const userId = 'test123';
    const courseId = 'CSE';
    const videoId = 'topic_1';
    
    console.log('1. Testing video progress update...');
    const progressResponse = await axios.post('http://localhost:8000/api/exam/video-progress', {
      userId: userId,
      courseId: courseId,
      videoId: videoId,
      isCompleted: true,
      progressPercentage: 25
    });
    
    console.log('Video progress response:', progressResponse.data);
    
    console.log('\n2. Testing user progress retrieval...');
    const resultsResponse = await axios.get(`http://localhost:8000/api/exam/results/${userId}`);
    
    console.log('User progress response:', resultsResponse.data);
    
    if (resultsResponse.data.success && resultsResponse.data.data) {
      const courseProgress = resultsResponse.data.data.find(c => c.courseId === courseId);
      if (courseProgress) {
        console.log(`\nCourse ${courseId} progress: ${courseProgress.completionPercentage}%`);
        console.log('Exam attempts:', courseProgress.examAttempts?.length || 0);
      }
    }
    
    console.log('\n✅ Progress tracking test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing progress tracking:', error.response?.data || error.message);
  }
}

testProgressTracking();