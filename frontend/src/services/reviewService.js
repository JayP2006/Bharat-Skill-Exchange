import api from '../config/api';

export const reviewService = {
  // Submit a review for a booking
  createReview: async (bookingId, reviewData) => {
    const response = await api.post(`/reviews/booking/${bookingId}`, reviewData);
    return response.data;
  },

  // Get reviews for a specific user (Guru)
  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Get reviews for a specific skill
  getSkillReviews: async (skillId) => {
    const response = await api.get(`/reviews/skill/${skillId}`);
    return response.data;
  }
};