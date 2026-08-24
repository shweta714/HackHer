import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const canteenApi = {
  getAll: () => api.get('/canteens'),
  getById: (canteenId) => api.get(`/canteens/${canteenId}`),
  getMenu: (params = {}) => api.get('/menu', { params }),
  getItemById: (itemId) => api.get(`/menu/${itemId}`),
  getRecommendations: (itemId, limit = 4, canteenId = null) =>
    api.get(`/menu/${itemId}/recommendations`, { params: { limit, canteenId } }),
};

// Backward compatible alias
export const serviceApi = {
  getAll: () => canteenApi.getAll(),
  getById: (id) => canteenApi.getById(id),
  getRecommendations: (id, limit = 4) => canteenApi.getRecommendations(id, limit),
};

export const orderApi = {
  createOrder: (orderData) => api.post('/queue/order', orderData),
  getOrderDetails: (orderId, canteenId = null) =>
    api.get(`/queue/order/${orderId}`, { params: { canteenId } }),
  updateStatus: (orderId, status, canteenId = null) =>
    api.put(`/queue/order/${orderId}/status`, { status, canteenId }),
  removeOrder: (orderId, canteenId = null) =>
    api.delete(`/queue/order/${orderId}`, { params: { canteenId } }),
  cancelOrder: (tokenNumber, locationId = 'main-campus') =>
    api.delete(`/token/${tokenNumber}`, { params: { locationId } }),
};

export const queueApi = {
  joinQueue: (data) => orderApi.createOrder(data),
  getQueueStatus: (locationId = 'main-campus') => api.get(`/queue/status/${locationId}`),
  serveNext: (locationId = 'main-campus') => api.post(`/queue/serve-next/${locationId}`),
  updateConfig: (locationId = 'main-campus', data) => api.put(`/queue/config/${locationId}`, data),
  removeOrder: (orderId, locationId = 'main-campus') => orderApi.removeOrder(orderId, locationId),
  seedDemo: (locationId = 'main-campus') => api.post(`/queue/seed/${locationId}`),
  resetQueue: (locationId = 'main-campus') => api.post(`/queue/reset/${locationId}`),
  getAnalytics: (locationId = 'main-campus') => api.get(`/queue/analytics/${locationId}`),
};

export const tokenApi = {
  getTokenDetails: (tokenNumber, locationId = 'main-campus') =>
    orderApi.getOrderDetails(tokenNumber, locationId),
  cancelToken: (tokenNumber, locationId = 'main-campus') =>
    orderApi.cancelOrder(tokenNumber, locationId),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export default api;
