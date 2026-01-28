import api from '../config/api';

export const bookingService = {
  // Create a booking (Learner)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Learner bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  scheduleBooking: async (bookingId, data) => {
  const res = await api.patch(`/bookings/${bookingId}/schedule`, data);
  return res.data;
},

  // Guru booking requests
    getBookingRequests: async () => {
    const response = await api.get('/bookings/guru');
    return response.data;
  },

  // Accept booking (Guru)
  acceptBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/accept`);
    return response.data;
  },

  // Reject / Cancel booking (Guru)
  rejectBooking: async (bookingId, reason = 'Rejected by guru') => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  },

  // Cancel booking (Learner)
  cancelBooking: async (bookingId, reason = 'Cancelled by learner') => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  },

  // Complete booking (Guru)
  completeBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/complete`);
    return response.data;
  },
};
