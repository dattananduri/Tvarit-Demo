import api from './api';

export const authService = {
  loginCustomer: async (email, password) => {
    const response = await api.post('/api/auth/customer/login', { email, password });
    return response.data;
  },

  loginPartner: async (email, password) => {
    const response = await api.post('/api/auth/partner/login', { email, password });
    return response.data;
  },

  loginAdmin: async (email, password) => {
    const response = await api.post('/api/auth/admin/login', { email, password });
    return response.data;
  },

  registerCustomer: async (customerData) => {
    const response = await api.post('/api/auth/register/customer', customerData);
    return response.data;
  },

  registerPartner: async (partnerData) => {
    const response = await api.post('/api/auth/register/partner', partnerData);
    return response.data;
  },
};
