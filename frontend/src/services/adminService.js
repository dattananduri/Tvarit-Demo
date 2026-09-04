import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },

  getOrders: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/api/admin/orders', { params });
    return response.data;
  },

  getPartners: async () => {
    const response = await api.get('/api/admin/partners');
    return response.data;
  },

  getCustomers: async () => {
    const response = await api.get('/api/admin/customers');
    return response.data;
  },
};
