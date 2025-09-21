// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_URL = `${API_BASE_URL}/api`;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to create auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};