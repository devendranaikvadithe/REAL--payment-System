import axios from 'axios';

const API_URL =
import.meta.env.VITE_API_URL ||
'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateWallet: (data) => api.put('/auth/wallet', data)
};

export const paymentAPI = {
  initiate: (data) => api.post('/payment/initiate', data),
  process: (transactionId) => api.post(`/payment/${transactionId}/process`),
  getStatus: (transactionId) => api.get(`/payment/${transactionId}/status`),
  getTransactions: (params) => api.get('/payment/transactions', { params }),
  getTransaction: (transactionId) => api.get(`/payment/transactions/${transactionId}`)
};

export default api;