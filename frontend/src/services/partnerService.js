import api from './api';

export const partnerService = {
  getProfile: async () => {
    const response = await api.get('/api/partner/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/partner/me', data);
    return response.data;
  },

  toggleStatus: async (isOnline) => {
    const response = await api.put('/api/partner/toggle-status', { isOnline });
    return response.data;
  },

  getAvailableOrders: async () => {
    const response = await api.get('/api/partner/orders/available');
    return response.data;
  },

  getActiveOrders: async () => {
    const response = await api.get('/api/partner/orders/active');
    return response.data;
  },

  getOrderHistory: async () => {
    const response = await api.get('/api/partner/orders/history');
    return response.data;
  },

  getEarnings: async () => {
    const response = await api.get('/api/partner/earnings');
    return response.data;
  },
};
