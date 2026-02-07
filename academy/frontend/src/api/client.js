import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',  // Django: /api/ + students.urls
});

// JWT Token Interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // JWT expects: {username, password}
  login: (data) => apiClient.post('token/', data),
  
  // Custom register endpoint
  register: (data) => apiClient.post('register/', data),
};

export const studentsAPI = {
  // Router: /api/viewset-students/ (auto-generated)
  list: (params = {}) => apiClient.get('viewset-students/', { params }),
};

export const coursesAPI = {
  list: (params = {}) => apiClient.get('courses/', { params }),
  retrieve: (id) => apiClient.get(`courses/${id}/`),
};
export default apiClient;
