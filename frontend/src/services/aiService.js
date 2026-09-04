import api from './api';

export const aiService = {
  askTvarit: async (prompt) => {
    const response = await api.post('/api/ai/chat', { prompt });
    return response.data;
  },

  snapAndShop: async (imageBase64, filenameHint) => {
    const response = await api.post('/api/ai/snap-and-shop', { image: imageBase64, filenameHint });
    return response.data;
  },

  parseVoice: async (transcript) => {
    const response = await api.post('/api/ai/voice-parse', { transcript });
    return response.data;
  },
};
