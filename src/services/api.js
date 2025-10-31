/**
 * API Service Layer
 * 
 * Centralized API client configuration and service functions for backend communication.
 * Handles:
 * - Axios instance configuration with base URL
 * - Request/response interceptors for authentication and error handling
 * - Data normalization between backend and frontend formats
 * - Authentication API endpoints (signup, login, getCurrentUser)
 * - Task management API endpoints (CRUD operations)
 */

import axios from 'axios';

// Backend API base URL - Change this for different environments
const API_BASE_URL = 'https://zylentrix-backend.onrender.com';

/**
 * Normalizes a single task from backend format to frontend format
 * Backend uses: { _id, status: 'Done' | 'Pending' }
 * Frontend expects: { id, completed: boolean }
 * 
 * @param {Object} task - Task object from backend
 * @returns {Object} - Normalized task object for frontend
 */
const normalizeTask = (task) => {
  if (!task) return task;
  
  // Convert MongoDB _id to frontend id
  const { _id, ...rest } = task;
  return {
    ...rest,
    id: _id || task.id, // Use _id from backend or fallback to existing id
    // Convert status string to boolean completed flag
    completed: task.status === 'Done' || task.completed
  };
};

/**
 * Normalizes an array of tasks from backend format to frontend format
 * 
 * @param {Array} tasks - Array of task objects from backend
 * @returns {Array} - Array of normalized task objects
 */
const normalizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) return [];
  return tasks.map(normalizeTask);
};

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all API requests if available in localStorage
 * This ensures authenticated requests don't need to manually add the Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses, specifically 401 Unauthorized errors.
 * When a 401 is received, it clears authentication data and redirects to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access (expired/invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API
 * Handles user authentication operations
 */
export const authAPI = {
  /**
   * Register a new user account
   * @param {Object} userData - User registration data (email, password, name)
   * @returns {Object} - Object containing JWT token
   */
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    const data = response.data.data || response.data; // Handle nested or flat response
    return { token: data.token };
  },

  /**
   * Authenticate existing user and get access token
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Object} - Object containing JWT token
   */
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data.data || response.data; // Handle nested or flat response
    return { token: data.token };
  },

  /**
   * Get current logged-in user details
   * Requires valid JWT token in Authorization header
   * @returns {Object} - User object (name, email, id, etc.)
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data.data || response.data; // Handle nested or flat response
  },
};

/**
 * Tasks API
 * Handles task management operations (CRUD)
 */
export const tasksAPI = {
  /**
   * Fetch all tasks for the authenticated user
   * @returns {Array} - Array of normalized task objects
   */
  getTasks: async () => {
    const response = await api.get('/api/tasks');
    const tasks = response.data.data || response.data; // Handle nested or flat response
    return normalizeTasks(tasks); // Normalize backend format to frontend format
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, deadline, status)
   * @returns {Object} - Created task object (normalized)
   */
  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    const task = response.data.data || response.data;
    return normalizeTask(task);
  },

  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Object} - Updated task object (normalized)
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    const task = response.data.data || response.data;
    return normalizeTask(task);
  },

  /**
   * Delete a task
   * @param {string} id - Task ID to delete
   * @returns {Object} - Deletion response
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
};

// Export the configured axios instance for direct use if needed
export default api;

