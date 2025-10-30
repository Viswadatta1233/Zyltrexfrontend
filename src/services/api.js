import axios from 'axios';

const API_BASE_URL = 'https://zylentrix-backend.onrender.com';

// Convert task from backend format to frontend format
const normalizeTask = (task) => {
  if (!task) return task;
  // Convert _id to id for frontend consistency
  const { _id, ...rest } = task;
  return {
    ...rest,
    id: _id || task.id,
    completed: task.status === 'Done' || task.completed
  };
};

// Convert task array from backend format to frontend format
const normalizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) return [];
  return tasks.map(normalizeTask);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    const data = response.data.data || response.data;
    return { token: data.token };
  },
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data.data || response.data;
    return { token: data.token };
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data.data || response.data;
  },
};

export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get('/api/tasks');
    const tasks = response.data.data || response.data;
    return normalizeTasks(tasks);
  },
  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    const task = response.data.data || response.data;
    return normalizeTask(task);
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    const task = response.data.data || response.data;
    return normalizeTask(task);
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
};

export default api;

