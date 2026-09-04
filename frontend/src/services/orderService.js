import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.put(`/api/orders/${orderId}/accept`);
    return response.data;
  },

  updateStatus: async (orderId, status) => {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  },

  updateItemPurchased: async (orderId, itemId, isPurchased) => {
    const response = await api.put(`/api/orders/${orderId}/items/${itemId}/purchase`, { isPurchased });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};
