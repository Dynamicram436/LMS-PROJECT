async function testExamEndpoint() {
  try {
    console.log('Testing exam questions endpoint...');
    
    const response = await fetch('http://localhost:8000/api/exam/questions/CSE');
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Questions count:', data.data.questions.length);
    console.log('First question:', data.data.questions[0]);
    
    // Test the frontend logic
    const questions = data.data.questions;
    console.log('\n--- Testing frontend logic ---');
    
    // Simulate getCurrentQuestion function
    const getCurrentQuestion = (index) => {
      const q = questions[index];
      if (!q) return { question: "", options: [], answer: 0 };
      
      if (q.question && q.options) {
        return {
          question: q.question,
          options: q.options,
          answer: q.correctAnswer
        };
      } else if (q.qDesc && q.choices) {
        const correctIndex = q.choices.indexOf(q.correctAns);
        return {
          question: q.qDesc,
          options: q.choices,
          answer: correctIndex >= 0 ? correctIndex : 0
        };
      }
      
      return { question: "", options: [], answer: 0 };
    };
    
    const current = getCurrentQuestion(0);
    console.log('Processed first question:');
    console.log('- Question:', current.question);
    console.log('- Options:', current.options);
    console.log('- Answer index:', current.answer);
    console.log('- Answer text:', current.options[current.answer]);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testExamEndpoint();