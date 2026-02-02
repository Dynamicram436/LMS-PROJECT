import React, { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const BackendTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testBackend = async () => {
      const results = {};
      
      try {
        // Test 1: Basic backend connectivity
        try {
          const response = await fetch('http://localhost:8000/');
          results.backendConnectivity = {
            success: response.ok,
            status: response.status,
            statusText: response.statusText
          };
        } catch (error) {
          results.backendConnectivity = {
            success: false,
            error: error.message
          };
        }

        // Test 2: API endpoint connectivity
        try {
          const response = await apiClient.get('/exam/questions?category=CSE');
          results.apiEndpoint = {
            success: response.data.success,
            dataLength: response.data.data?.questions?.length || 0
          };
        } catch (error) {
          results.apiEndpoint = {
            success: false,
            error: error.message,
            response: error.response?.data
          };
        }

        // Test 3: Check if user exists in localStorage
        const user = localStorage.getItem('user');
        results.userInStorage = {
          exists: !!user,
          data: user ? JSON.parse(user) : null
        };

        // Test 4: Test exam results API if user exists
        if (user) {
          const userData = JSON.parse(user);
          try {
            const response = await apiClient.get(`/exam/results/${userData.userid}`);
            results.examResultsAPI = {
              success: response.data.success,
              dataLength: response.data.data?.length || 0,
              sampleData: response.data.data?.[0] || null
            };
          } catch (error) {
            results.examResultsAPI = {
              success: false,
              error: error.message,
              response: error.response?.data
            };
          }
        } else {
          results.examResultsAPI = {
            success: false,
            error: 'No user found in localStorage'
          };
        }

      } catch (error) {
        results.generalError = error.message;
      }

      setTestResults(results);
      setLoading(false);
    };

    testBackend();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Testing Backend Connection...</h2>
        <div className="animate-pulse">Running tests...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Backend Connection Test</h2>
      
      <div className="space-y-4">
        {/* Backend Connectivity */}
        <div className={`p-4 rounded-lg ${testResults.backendConnectivity?.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="font-bold mb-2">Backend Connectivity</h3>
          <pre className="text-sm">
            {JSON.stringify(testResults.backendConnectivity, null, 2)}
          </pre>
        </div>

        {/* API Endpoint */}
        <div className={`p-4 rounded-lg ${testResults.apiEndpoint?.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="font-bold mb-2">API Endpoint Test</h3>
          <pre className="text-sm">
            {JSON.stringify(testResults.apiEndpoint, null, 2)}
          </pre>
        </div>

        {/* User in Storage */}
        <div className={`p-4 rounded-lg ${testResults.userInStorage?.exists ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h3 className="font-bold mb-2">User in localStorage</h3>
          <pre className="text-sm overflow-auto max-h-40">
            {JSON.stringify(testResults.userInStorage, null, 2)}
          </pre>
        </div>

        {/* Exam Results API */}
        <div className={`p-4 rounded-lg ${testResults.examResultsAPI?.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="font-bold mb-2">Exam Results API</h3>
          <pre className="text-sm overflow-auto max-h-40">
            {JSON.stringify(testResults.examResultsAPI, null, 2)}
          </pre>
        </div>

        {/* General Error */}
        {testResults.generalError && (
          <div className="p-4 rounded-lg bg-red-50">
            <h3 className="font-bold mb-2">General Error</h3>
            <pre className="text-sm">
              {JSON.stringify(testResults.generalError, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retest Connection
          </button>
          {testResults.userInStorage?.exists && (
            <button
              onClick={() => {
                const userData = testResults.userInStorage.data;
                console.log('User data:', userData);
                console.log('Exam results:', userData.examResults);
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Log User Data to Console
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
