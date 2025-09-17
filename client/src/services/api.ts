// client/src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (userData: any) => api.post('/auth/login', userData),
};

export const chat = {
  sendMessage: (message: string) => api.post('/chat/send', { message }),
  getHistory: (params?: { limit?: number; before?: string }) =>
    api.get('/chat/history', { params }),
};

export default api;