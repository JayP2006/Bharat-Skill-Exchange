import api from '../config/api';

export const sessionService = {
  /**
   * SHISHYA → Request a session
   * body: { receiverId, skillName, requestedDate }
   */
  requestSession: async (data) => {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  /**
   * GURU + SHISHYA → Get all my sessions
   */
  getMySessions: async () => {
    const response = await api.get('/sessions/my');
    return response.data;
  },

  /**
   * GURU → Accept & Schedule session
   * (meeting link auto-generated in backend)
   */
  acceptSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/accept`);
    return response.data;
  },

  /**
   * GURU → Complete session
   * (credits settle here)
   */
  completeSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/complete`);
    return response.data;
  },
  getUpcomingSessions: async () => {
    const response = await api.get('/sessions/upcoming');
    return response.data;
  },
  
  // getAllSessions: async () => {
  //   const response = await api.get('/sessions/all');
  //   return response.data;
  // },
  getSessions: async (filterType = 'all') => {
    const response = await api.get(`/sessions/all?filter=${filterType}`);
    return response.data;
  },
};
