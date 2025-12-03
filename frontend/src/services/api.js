import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
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

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Student APIs
export const studentAPI = {
  getProjects: () => api.get('/student/projects'),
  getProjectTasks: (projectId) => api.get(`/student/projects/${projectId}/tasks`),
  getTask: (taskId) => api.get(`/student/tasks/${taskId}`),
  submitTask: (data) => api.post('/student/submit-task', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Advisor APIs
export const advisorAPI = {
  getProjects: () => api.get('/advisor/projects'),
  createProject: (data) => api.post('/advisor/create-project', data),
  deleteProject: (projectId) => api.delete(`/advisor/projects/${projectId}`),
  addStudent: (data) => api.post('/advisor/add-student', data),
  getProjectTasks: (projectId) => api.get(`/advisor/projects/${projectId}/tasks`),
  createTask: (data) => api.post('/advisor/create-task', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateTask: (taskId, data) => api.patch(`/advisor/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/advisor/tasks/${taskId}`),
  getTaskSubmissions: (taskId) => api.get(`/advisor/tasks/${taskId}/submissions`),
  gradeSubmission: (submissionId, data) => api.patch(`/advisor/submissions/${submissionId}/grade`, data),
  completeTask: (taskId) => api.patch(`/advisor/tasks/${taskId}/complete`),
  getAllStudents: () => api.get('/advisor/students'),
};

// Admin APIs
export const adminAPI = {
  createUser: (data) => api.post('/admin/create-user', data),
  createProject: (data) => api.post('/admin/create-project', data),
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
  getProjects: () => api.get('/admin/projects'),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  updateProject: (id, data) => api.patch(`/admin/projects/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
};

// Discussion APIs
export const discussionAPI = {
  getMessages: (projectId) => api.get(`/discussions/${projectId}`),
  postMessage: (projectId, data) => api.post(`/discussions/${projectId}`, data),
};

// Progress APIs
export const progressAPI = {
  getProjectProgress: (projectId) => api.get(`/progress/project/${projectId}`),
  getTaskProgress: (taskId) => api.get(`/progress/task/${taskId}`),
};

// Chatbot APIs
export const chatbotAPI = {
  ask: (data) => api.post('/chatbot/ask', data),
};

export default api;
