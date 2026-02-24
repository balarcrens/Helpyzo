import axios from 'axios';

// Backend API base URL
const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('auth-token');
            localStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
