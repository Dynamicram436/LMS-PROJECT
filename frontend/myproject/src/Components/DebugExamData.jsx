import React, { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const DebugExamData = () => {
  const [userData, setUserData] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const fetchExamResults = async () => {
    if (!userData?.userid) {
      toast.error('No user logged in');
      return;
    }

    setLoading(true);
    try {
      console.log(`[Debug] Fetching exam results for userId: ${userData.userid}`);
      
      const response = await apiClient.get(`/exam/results/${userData.userid}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      console.log('[Debug] API Response:', response.data);
      setRawResponse(response.data);

      if (response.data.success) {
        setExamResults(response.data.data || []);
        toast.success(`Loaded ${response.data.data?.length || 0} exam results`);
      } else {
        toast.error('Failed to load exam results');
      }
    } catch (error) {
      console.error('[Debug] Error fetching exam results:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      toast.info('Refreshed user data from localStorage');
    }
  };

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear local storage data?')) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.examResults = [];
        localStorage.setItem('user', JSON.stringify(user));
        setUserData(user);
        toast.warning('Cleared examResults from localStorage');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🔍 Exam Data Debugger</h1>
          
          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h2 className="font-bold mb-2">Current User:</h2>
            {userData ? (
              <div>
                <p><strong>User ID:</strong> {userData.userid}</p>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Exam Results in localStorage:</strong> {userData.examResults?.length || 0}</p>
              </div>
            ) : (
              <p className="text-gray-500">No user logged in</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={fetchExamResults}
              disabled={loading || !userData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Fetch Exam Results from API'}
            </button>
            <button
              onClick={refreshLocalStorage}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Refresh from localStorage
            </button>
            <button
              onClick={clearLocalStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear localStorage examResults
            </button>
          </div>

          {/* Raw API Response */}
          {rawResponse && (
            <div className="mb-6">
              <h2 className="font-bold mb-2">Raw API Response:</h2>
              <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Exam Results Table */}
          {examResults.length > 0 && (
            <div>
              <h2 className="font-bold mb-3">Exam Results ({examResults.length}):</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Course ID</th>
                      <th className="border px-4 py-2">Course Name</th>
                      <th className="border px-4 py-2">Score</th>
                      <th className="border px-4 py-2">Passed</th>
                      <th className="border px-4 py-2">Attempts</th>
                      <th className="border px-4 py-2">Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map((result, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{result.courseId}</td>
                        <td className="border px-4 py-2">{result.courseName}</td>
                        <td className="border px-4 py-2">{result.score}%</td>
                        <td className="border px-4 py-2">
                          <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                            {result.passed ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td className="border px-4 py-2">{result.examAttempts?.length || 0}</td>
                        <td className="border px-4 py-2">{result.completionPercentage || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Attempts */}
              <div className="mt-6">
                <h3 className="font-bold mb-3">Detailed Attempts:</h3>
                {examResults.map((result, idx) => (
                  <div key={idx} className="mb-4 p-4 border rounded">
                    <h4 className="font-semibold mb-2">{result.courseName || result.courseId}</h4>
                    {result.examAttempts && result.examAttempts.length > 0 ? (
                      <div className="space-y-2">
                        {result.examAttempts.map((attempt, attemptIdx) => (
                          <div key={attemptIdx} className="p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium">Attempt #{attempt.attemptNumber || attemptIdx + 1}:</span>
                            <span className="ml-2">Score: {attempt.score}%</span>
                            <span className="ml-2">
                              {attempt.passed ? '✓ Passed' : '✗ Failed'}
                            </span>
                            <span className="ml-2 text-gray-500">
                              {attempt.attemptDate ? new Date(attempt.attemptDate).toLocaleString() : 'No date'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No attempts recorded</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {examResults.length === 0 && rawResponse && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No exam results found</p>
              <p className="text-sm">Try submitting an exam first</p>
            </div>
          )}
        </div>

        {/* localStorage Data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-bold mb-3">localStorage User Data:</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugExamData;
