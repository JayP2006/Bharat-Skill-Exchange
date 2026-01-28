import api from '../config/api';

export const skillService = {
  // Get all skills with optional filters
  getAllSkills: async (params = {}) => {
    const response = await api.get('/skills', { params });
    return response.data;
  },

  // Get single skill by ID
  getSkillById: async (skillId) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.data;
  },

  // Create new skill
  createSkill: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  // Update skill
  updateSkill: async (skillId, skillData) => {
    const response = await api.put(`/skills/${skillId}`, skillData);
    return response.data;
  },

  // Delete skill
  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },

  // Get user's skills
  getMySkills: async () => {
    const response = await api.get('/skills/my-skills');
    return response.data;
  },

  // Search skills
  searchSkills: async (query) => {
    const response = await api.get('/skills/search', { params: { q: query } });
    return response.data;
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    const response = await api.get('/skills/category/' + category);
    return response.data;
  },
};
