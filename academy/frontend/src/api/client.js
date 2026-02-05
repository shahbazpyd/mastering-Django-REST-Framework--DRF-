import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Localhost proxy to Django
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('token/', data),
};

export const studentsAPI = {
  list: (params = {}) => api.get('students/', { params }),
};

export default api;
