import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Create axios instance for auth endpoints
export const authAPI = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for main API endpoints
export const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login/',
  register: '/auth/register/',
  profile: '/auth/profile/',
  updateProfile: '/auth/profile/update/',
  
  // Events
  events: '/events/',
  eventDetail: (id) => `/events/${id}/`,
  
  // Exams
  exams: '/exams/',
  examDetail: (id) => `/exams/${id}/`,
  
  // Results
  results: '/results/',
  resultDetail: (id) => `/results/${id}/`,
  
  // Study Materials
  materials: '/materials/',
  materialDetail: (id) => `/materials/${id}/`,
  
  // Utility
  dashboardStats: '/dashboard-stats/',
  students: '/students/',
  faculty: '/faculty/',
};

// API service functions
export const apiService = {
  // Events
  getEvents: (params) => api.get(endpoints.events, { params }),
  getEvent: (id) => api.get(endpoints.eventDetail(id)),
  createEvent: (data) => api.post(endpoints.events, data),
  updateEvent: (id, data) => api.put(endpoints.eventDetail(id), data),
  deleteEvent: (id) => api.delete(endpoints.eventDetail(id)),
  
  // Exams
  getExams: (params) => api.get(endpoints.exams, { params }),
  getExam: (id) => api.get(endpoints.examDetail(id)),
  createExam: (data) => api.post(endpoints.exams, data),
  updateExam: (id, data) => api.put(endpoints.examDetail(id), data),
  deleteExam: (id) => api.delete(endpoints.examDetail(id)),
  
  // Results
  getResults: (params) => api.get(endpoints.results, { params }),
  getResult: (id) => api.get(endpoints.resultDetail(id)),
  createResult: (data) => api.post(endpoints.results, data),
  updateResult: (id, data) => api.put(endpoints.resultDetail(id), data),
  deleteResult: (id) => api.delete(endpoints.resultDetail(id)),
  
  // Study Materials
  getMaterials: (params) => api.get(endpoints.materials, { params }),
  getMaterial: (id) => api.get(endpoints.materialDetail(id)),
  createMaterial: (data) =>
    api.post(endpoints.materials, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMaterial: (id, data) =>
    api.put(endpoints.materialDetail(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMaterial: (id) => api.delete(endpoints.materialDetail(id)),
  
  // Utility
  getDashboardStats: () => api.get(endpoints.dashboardStats),
  getStudents: () => api.get(endpoints.students),
  getFaculty: () => api.get(endpoints.faculty),
  
  // Messages
  sendMessage: (data) => api.post('/messages/', data),
};
