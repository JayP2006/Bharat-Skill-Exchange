import api from '../config/api';

export const workshopService = {
  // Get all workshops
  getAllWorkshops: async (params = {}) => {
    const response = await api.get('/workshops', { params });
    return response.data;
  },

  // Get workshop by ID
  getWorkshopById: async (workshopId) => {
    const response = await api.get(`/workshops/${workshopId}`);
    return response.data;
  },

  // Create workshop
  createWorkshop: async (workshopData) => {
    const response = await api.post('/workshops', workshopData);
    return response.data;
  },

  // Update workshop
  updateWorkshop: async (workshopId, workshopData) => {
    const response = await api.put(`/workshops/${workshopId}`, workshopData);
    return response.data;
  },

  // Delete workshop
  deleteWorkshop: async (workshopId) => {
    const response = await api.delete(`/workshops/${workshopId}`);
    return response.data;
  },

  // Register for workshop
  registerWorkshop: async (workshopId) => {
    const response = await api.post(`/workshops/${workshopId}/register`);
    return response.data;
  },

  // Get my workshops (created by me)
  getMyWorkshops: async () => {
    const response = await api.get('/workshops/my-workshops');
    return response.data;
  },

  // Get enrolled workshops
  getEnrolledWorkshops: async () => {
    const response = await api.get('/workshops/enrolled');
    return response.data;
  },
};
