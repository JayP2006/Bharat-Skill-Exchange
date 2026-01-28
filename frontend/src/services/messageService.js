import api from '../config/api';

export const messageService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // Get messages with a specific user
  getMessages: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  // Send message (Needs receiverId and content)
  sendMessage: async (receiverId, content) => {
    const response = await api.post('/messages', { receiverId, content });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (userId) => {
    const response = await api.put(`/messages/${userId}/read`);
    return response.data;
  },
};