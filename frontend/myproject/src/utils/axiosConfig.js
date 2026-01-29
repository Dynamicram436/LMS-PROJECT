import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle duplicate requests and add auth tokens
const pendingRequests = new Map();

apiClient.interceptors.request.use(
  (config) => {
    // Add token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip duplicate request check for exam submission, video progress, and progress fetch
    if (((config.url?.includes('/exam/results') || config.url?.includes('/exam/video-progress')) && config.method === 'post') ||
        (config.url?.includes('/exam/results/') && config.method === 'get')) {
      return config;
    }

    // Generate a unique key for the request to identify duplicates
    // For GET requests, use only method and URL to prevent multiple requests to same endpoint
    // For POST requests, include data to distinguish different payloads
    let requestKey;
    if (config.method?.toUpperCase() === 'GET') {
      requestKey = `${config.method?.toUpperCase()}_${config.url}`;
    } else {
      requestKey = `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}_${JSON.stringify(config.data || {})}`;
    }

    // Cancel previous identical request if still pending
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey).cancel('Duplicate request cancelled');
    }

    // Create a cancel token for this request
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // Store the cancel source for this request
    pendingRequests.set(requestKey, source);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clean up pending requests
apiClient.interceptors.response.use(
  (response) => {
    // Remove the request from pending map on success
    // Use the same logic as in request interceptor
    let requestKey;
    if (response.config.method?.toUpperCase() === 'GET') {
      requestKey = `${response.config.method?.toUpperCase()}_${response.config.url}`;
    } else {
      requestKey = `${response.config.method?.toUpperCase()}_${response.config.url}_${JSON.stringify(response.config.params || {})}_${JSON.stringify(response.config.data || {})}`;
    }
    pendingRequests.delete(requestKey);

    return response;
  },
  (error) => {
    // Remove the request from pending map on error
    if (error.config) {
      // Use the same logic as in request interceptor
      let requestKey;
      if (error.config.method?.toUpperCase() === 'GET') {
        requestKey = `${error.config.method?.toUpperCase()}_${error.config.url}`;
      } else {
        requestKey = `${error.config.method?.toUpperCase()}_${error.config.url}_${JSON.stringify(error.config.params || {})}_${JSON.stringify(error.config.data || {})}`;
      }
      pendingRequests.delete(requestKey);
    }

    // Handle cancellation errors gracefully
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject({ ...error, isCancelled: true });
    }

    return Promise.reject(error);
  }
);

export default apiClient;