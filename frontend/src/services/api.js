/**
 * API Service Module
 * Centralized API client using Axios with automatic token management
 * Handles all HTTP requests to the backend and token refresh
 */

import axios from "axios";

// Base URLs from environment variables or defaults
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/**
 * Create Axios instance with base configuration
 * All requests will use this instance for consistent behavior
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== REQUEST INTERCEPTOR ==========
// Automatically attach JWT token to all outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Add token to Authorization header in Bearer format
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== RESPONSE INTERCEPTOR ==========
// Handle authentication errors and redirect to login if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, token is invalid or expired
    if (error.response?.status === 401) {
      // Clear stored credentials
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION ENDPOINTS ==========
// Handles user login, signup, and password management
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// ========== STUDENT ENDPOINTS ==========
// Handles student-specific operations like viewing projects and submitting tasks
export const studentAPI = {
  getProjects: () => api.get("/student/projects"),
  getProjectTasks: (projectId) =>
    api.get(`/student/projects/${projectId}/tasks`),
  getTask: (taskId) => api.get(`/student/tasks/${taskId}`),
  submitTask: (data) =>
    api.post("/student/submit-task", data, {
      headers: { "Content-Type": "multipart/form-data" }, // For file uploads
    }),
};

// ========== ADVISOR ENDPOINTS ==========
// Handles advisor operations like creating projects, managing tasks, and grading
export const advisorAPI = {
  getProjects: () => api.get("/advisor/projects"),
  createProject: (data) => api.post("/advisor/create-project", data),
  deleteProject: (projectId) => api.delete(`/advisor/projects/${projectId}`),
  addStudent: (data) => api.post("/advisor/add-student", data),
  getProjectTasks: (projectId) =>
    api.get(`/advisor/projects/${projectId}/tasks`),
  createTask: (data) =>
    api.post("/advisor/create-task", data, {
      headers: { "Content-Type": "multipart/form-data" }, // For file uploads
    }),
  updateTask: (taskId, data) => api.patch(`/advisor/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/advisor/tasks/${taskId}`),
  getTaskSubmissions: (taskId) =>
    api.get(`/advisor/tasks/${taskId}/submissions`),
  gradeSubmission: (submissionId, data) =>
    api.patch(`/advisor/submissions/${submissionId}/grade`, data),
  completeTask: (taskId) => api.patch(`/advisor/tasks/${taskId}/complete`),
  getAllStudents: () => api.get("/advisor/students"),
};

// ========== ADMIN ENDPOINTS ==========
// Handles admin operations like user and project management
export const adminAPI = {
  createUser: (data) => api.post("/admin/create-user", data),
  createProject: (data) => api.post("/admin/create-project", data),
  getUsers: (role) => api.get("/admin/users", { params: { role } }),
  getProjects: () => api.get("/admin/projects"),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  updateProject: (id, data) => api.patch(`/admin/projects/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
};

// ========== DISCUSSION ENDPOINTS ==========
// Handles project discussions/chat messages
export const discussionAPI = {
  getMessages: (projectId) => api.get(`/discussions/${projectId}`),
  postMessage: (projectId, data) => api.post(`/discussions/${projectId}`, data),
};

// ========== PROGRESS ENDPOINTS ==========
// Handles project and task progress tracking
export const progressAPI = {
  getProjectProgress: (projectId) => api.get(`/progress/project/${projectId}`),
  getTaskProgress: (taskId) => api.get(`/progress/task/${taskId}`),
};

// ========== CHATBOT ENDPOINTS ==========
// Handles AI chatbot interactions
export const chatbotAPI = {
  ask: (data) => api.post("/chatbot/ask", data),
};

export default api;
