import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const serviceApi = {
  getAll: () => api.get('/services'),
  getById: (serviceId) => api.get(`/services/${serviceId}`),
  getRecommendations: (serviceId, limit = 4) => 
    api.get(`/services/${serviceId}/recommendations`, { params: { limit } }),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const queueApi = {
  joinQueue: (data) => api.post('/queue/join', data),
  getQueueStatus: (locationId = 'campus-canteen') => api.get(`/queue/status/${locationId}`),
  serveNext: (locationId = 'campus-canteen') => api.post(`/queue/serve-next/${locationId}`),
  updateConfig: (locationId = 'campus-canteen', data) => api.put(`/queue/config/${locationId}`, data),
  seedDemo: (locationId = 'campus-canteen') => api.post(`/queue/seed/${locationId}`),
  resetQueue: (locationId = 'campus-canteen') => api.post(`/queue/reset/${locationId}`),
  getAnalytics: (locationId = 'campus-canteen') => api.get(`/queue/analytics/${locationId}`),
};

export const tokenApi = {
  getTokenDetails: (tokenNumber, locationId = 'campus-canteen') => 
    api.get(`/token/${tokenNumber}`, { params: { locationId } }),
  cancelToken: (tokenNumber, locationId = 'campus-canteen') => 
    api.delete(`/token/${tokenNumber}`, { params: { locationId } }),
};

export default api;
