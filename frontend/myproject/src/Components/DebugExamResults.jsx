import React, { useEffect, useState } from 'react';
import apiClient from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const DebugExamResults = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugExamResults = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setDebugInfo({ error: "No user found in localStorage" });
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      
      try {
        // Get user data from localStorage
        setDebugInfo(prev => ({
          ...prev,
          localStorageUser: userData,
          examResultsInStorage: userData.examResults || []
        }));

        // Fetch fresh data from backend
        console.log("Debug: Fetching exam results for user:", userData.userid);
        const response = await apiClient.get(`/exam/results/${userData.userid}`);
        
        console.log("Debug: Backend response:", response.data);
        
        setDebugInfo(prev => ({
          ...prev,
          backendResponse: response.data,
          examResultsFromBackend: response.data.data || []
        }));

        // Test dispatching exam submission event
        window.dispatchEvent(new CustomEvent('examSubmitted', {
          detail: {
            userId: userData.userid,
            courseId: 'TEST-COURSE',
            score: 85,
            passed: true,
            result: { answers: [] }
          }
        }));

        toast.info("Debug test event dispatched. Check console logs.");

      } catch (error) {
        console.error("Debug: Error fetching exam results:", error);
        setDebugInfo(prev => ({
          ...prev,
          error: error.message,
          errorDetails: error.response?.data
        }));
      } finally {
        setLoading(false);
      }
    };

    debugExamResults();

    // Listen for the test event
    const handleExamSubmission = (event) => {
      console.log("Debug: Received exam submission event:", event.detail);
      setDebugInfo(prev => ({
        ...prev,
        receivedEvent: event.detail
      }));
    };

    window.addEventListener("examSubmitted", handleExamSubmission);
    return () => window.removeEventListener("examSubmitted", handleExamSubmission);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Debug Exam Results</h2>
        <p>Loading debug information...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Debug Exam Results</h2>
      
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">User Information</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo.localStorageUser, null, 2)}
          </pre>
        </div>

        {/* Exam Results in Storage */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">
            Exam Results in localStorage ({debugInfo.examResultsInStorage?.length || 0} items)
          </h3>
          <pre className="text-sm overflow-auto max-h-60">
            {JSON.stringify(debugInfo.examResultsInStorage, null, 2)}
          </pre>
        </div>

        {/* Backend Response */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">
            Backend Response ({debugInfo.examResultsFromBackend?.length || 0} items)
          </h3>
          <pre className="text-sm overflow-auto max-h-60">
            {JSON.stringify(debugInfo.backendResponse, null, 2)}
          </pre>
        </div>

        {/* Received Event */}
        {debugInfo.receivedEvent && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Received Event</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo.receivedEvent, null, 2)}
            </pre>
          </div>
        )}

        {/* Error Info */}
        {debugInfo.error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Error Information</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify({
                error: debugInfo.error,
                details: debugInfo.errorDetails
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Debug Info
          </button>
          <button
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user"));
              if (user) {
                console.log("Current localStorage user data:", user);
                console.log("Exam results:", user.examResults);
              }
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Log User Data to Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugExamResults;
