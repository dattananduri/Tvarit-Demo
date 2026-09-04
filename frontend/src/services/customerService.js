import api from './api';

export const customerService = {
  getProfile: async () => {
    const response = await api.get('/api/customer/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/customer/me', data);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/api/customer/orders');
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get('/api/customer/addresses');
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/api/customer/addresses', addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/customer/addresses/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await api.put(`/api/customer/addresses/${addressId}/default`);
    return response.data;
  },
};
