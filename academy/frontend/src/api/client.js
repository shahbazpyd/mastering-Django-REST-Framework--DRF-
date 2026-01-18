import axios from "axios";


const API_BASE = "/api";

const api = axios.create({ baseURL: API_BASE });

// In your client.js - ensure token interceptor works
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔑 Sending token:", token ? "YES" : "NO"); // DEBUG
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const authAPI = {
  login: (data) => api.post("/token/", data),
};

export const studentsAPI = {
  list: () => api.get("/viewset-students/"),
  create: (data) => api.post("/viewset-students/", data),
  update: (id, data) => api.patch(`/viewset-students/${id}/`, data),
  delete: (id) => api.delete(`/viewset-students/${id}/`),
  report: (id) => api.post(`/viewset-students/${id}/generate_report/`),  // Celery task
};

export default api;
