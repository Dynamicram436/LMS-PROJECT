import React, { useState } from 'react';
import apiClient from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const ManualExamTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));

  const runManualTest = async () => {
    if (!user) {
      toast.error('No user found in localStorage. Please login first.');
      return;
    }

    setLoading(true);
    const testResults = {};

    try {
      // Step 1: Create a mock exam submission
      const mockExamData = {
        userId: user.userid,
        courseId: 'TEST-COURSE-MANUAL',
        score: 8,
        totalQuestions: 10,
        answers: [
          {
            questionIndex: 0,
            selectedOption: 0,
            isCorrect: true,
            question: 'Test Question 1',
            options: ['A', 'B', 'C', 'D']
          },
          {
            questionIndex: 1,
            selectedOption: 1,
            isCorrect: false,
            question: 'Test Question 2',
            options: ['A', 'B', 'C', 'D']
          }
        ]
      };

      console.log('Step 1: Submitting mock exam data...', mockExamData);
      
      // Step 2: Submit exam to backend
      try {
        const submitResponse = await apiClient.post('/exam/results', mockExamData);
        testResults.submitExam = {
          success: submitResponse.data.success,
          data: submitResponse.data
        };
        console.log('Submit response:', submitResponse.data);
        toast.success('Exam submitted successfully!');
      } catch (error) {
        testResults.submitExam = {
          success: false,
          error: error.message,
          response: error.response?.data
        };
        console.error('Submit error:', error);
        toast.error('Failed to submit exam');
      }

      // Step 3: Fetch exam results immediately
      try {
        const fetchResponse = await apiClient.get(`/exam/results/${user.userid}`);
        testResults.fetchResults = {
          success: fetchResponse.data.success,
          dataLength: fetchResponse.data.data?.length || 0,
          data: fetchResponse.data.data
        };
        console.log('Fetch response:', fetchResponse.data);
      } catch (error) {
        testResults.fetchResults = {
          success: false,
          error: error.message,
          response: error.response?.data
        };
        console.error('Fetch error:', error);
      }

      // Step 4: Test event dispatching
      const eventDetail = {
        userId: user.userid,
        courseId: 'TEST-COURSE-MANUAL',
        score: 80, // 8/10 * 100
        passed: true,
        result: {
          score: 80,
          passed: true,
          answers: mockExamData.answers,
          totalQuestions: 10,
          correctAnswers: 8
        }
      };

      console.log('Step 4: Dispatching examSubmitted event...', eventDetail);
      window.dispatchEvent(new CustomEvent('examSubmitted', {
        detail: eventDetail
      }));
      
      testResults.eventDispatched = {
        success: true,
        detail: eventDetail
      };

      toast.info('Event dispatched. Check if UI updates.');

      // Step 5: Check localStorage after event
      setTimeout(() => {
        const updatedUser = JSON.parse(localStorage.getItem('user'));
        testResults.localStorageAfter = {
          examResultsCount: updatedUser.examResults?.length || 0,
          examResults: updatedUser.examResults
        };
        setResults({ ...testResults });
      }, 1000);

    } catch (error) {
      testResults.generalError = error.message;
      console.error('General error:', error);
    } finally {
      setResults(testResults);
      setLoading(false);
    }
  };

  const clearTestData = async () => {
    try {
      // This is just for cleanup - you might need to implement this endpoint
      toast.info('Test data cleared (manual cleanup required)');
    } catch (error) {
      toast.error('Failed to clear test data');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manual Exam Test</h2>
      
      {!user ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Please login first to run this test.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Test User Info</h3>
            <p>User ID: {user.userid}</p>
            <p>Name: {user.name}</p>
            <p>Current exam results: {user.examResults?.length || 0}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={runManualTest}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Running Test...' : 'Run Manual Exam Test'}
            </button>
            
            <button
              onClick={clearTestData}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear Test Data
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {/* Submit Exam Results */}
              {results.submitExam && (
                <div className={`p-4 rounded-lg ${results.submitExam.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h3 className="font-bold mb-2">Step 1: Submit Exam</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(results.submitExam, null, 2)}
                  </pre>
                </div>
              )}

              {/* Fetch Results */}
              {results.fetchResults && (
                <div className={`p-4 rounded-lg ${results.fetchResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h3 className="font-bold mb-2">Step 2: Fetch Results</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(results.fetchResults, null, 2)}
                  </pre>
                </div>
              )}

              {/* Event Dispatch */}
              {results.eventDispatched && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Step 3: Event Dispatch</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(results.eventDispatched, null, 2)}
                  </pre>
                </div>
              )}

              {/* LocalStorage After */}
              {results.localStorageAfter && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Step 4: localStorage After Event</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(results.localStorageAfter, null, 2)}
                  </pre>
                </div>
              )}

              {/* General Error */}
              {results.generalError && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">General Error</h3>
                  <pre className="text-sm">
                    {JSON.stringify(results.generalError, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Run Manual Exam Test" to submit a mock exam</li>
              <li>Check if the exam is submitted successfully (Step 1)</li>
              <li>Check if results are fetched (Step 2)</li>
              <li>Check if event is dispatched (Step 3)</li>
              <li>Check if localStorage is updated (Step 4)</li>
              <li>Navigate to Home, Profile, and Performance pages to see if results appear</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualExamTest;
