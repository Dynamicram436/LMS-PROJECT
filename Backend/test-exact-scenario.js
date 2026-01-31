// Test the exact scenario that's failing
async function testExactScenario() {
  try {
    console.log('=== Testing Exact Exam Scenario ===');
    
    // Test what the frontend is likely calling
    const testCourseIds = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'Diploma'];
    
    for (const courseId of testCourseIds) {
      console.log(`\n--- Testing courseId: ${courseId} ---`);
      
      try {
        const response = await fetch(`http://localhost:8000/api/exam/questions/${courseId}`);
        const data = await response.json();
        
        console.log(`Status: ${response.status}`);
        console.log(`Success: ${data.success}`);
        console.log(`Questions count: ${data.data?.questions?.length || data.questions?.length || 0}`);
        
        if (data.success && (data.data?.questions?.length > 0 || data.questions?.length > 0)) {
          const questions = data.data?.questions || data.questions;
          console.log(`✓ Found ${questions.length} questions for ${courseId}`);
          console.log('Sample question:', questions[0]?.qDesc || questions[0]?.question);
        } else {
          console.log(`✗ No questions found for ${courseId}`);
          if (data.message) {
            console.log('Error message:', data.message);
          }
        }
      } catch (error) {
        console.log(`✗ Error testing ${courseId}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExactScenario();