import api from './api';

export const paymentService = {
  createPaymentOrder: async (amount, currency = 'INR', receipt = 'tvarit_order') => {
    const response = await api.post('/api/payments/create-order', {
      amount,
      currency,
      receipt,
    });
    return response.data;
  },

  verifyPayment: async (verificationPayload) => {
    const response = await api.post('/api/payments/verify', verificationPayload);
    return response.data;
  },
};
