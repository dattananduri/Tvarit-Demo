import api from './api';

export const reviewService = {
  submitReview: async (orderId, reviewData) => {
    const response = await api.post(`/api/customer/orders/${orderId}/review`, reviewData);
    return response.data;
  },

  getReviewForOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/customer/orders/${orderId}/review`);
      return response.data;
    } catch (e) {
      return null;
    }
  },

  getPartnerReviews: async () => {
    const response = await api.get('/api/partner/reviews');
    return response.data;
  },

  getAllReviews: async () => {
    const response = await api.get('/api/admin/reviews');
    return response.data;
  },
};
