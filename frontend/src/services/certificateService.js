import api from '../config/api';

export const certificateService = {
  getMyCertificates: async () => {
    const response = await api.get('/certificates/my-certificates');
    return response.data;
  },

  // 👇 New Function for Guru
  issueCertificate: async (data) => {
    const response = await api.post('/certificates/issue', data);
    return response.data;
  },

  downloadCertificate: async (certificateId) => {
    const response = await api.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob', // Important for PDF
    });
    return response.data;
  }
};