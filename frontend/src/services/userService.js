import api from '../config/api';

export const userService = {
  // Get user profile
  getProfile: async () => {
  const res = await api.get('/auth/me');
  return res.data;
}
,

  // Update profile
 updateProfile: async (profileData) => {
  const response = await api.put('/users/me/update', profileData);
  return response.data;
},


  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data;
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Update avatar
  updateAvatar: async (formData) => {
  const res = await api.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
},
};
