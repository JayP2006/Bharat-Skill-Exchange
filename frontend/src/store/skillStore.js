import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const useSkillStore = create((set) => ({
  // --- STATE ---
  skills: [], // For the public search page
  skill: null,  // For the single skill/booking page
  mySkills: [], // For the Guru's own profile page
  loading: false,

  // --- ACTIONS ---

  // Fetches all skills for the public search page (with search/location)
  fetchSkills: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/skills', { params });
      set({ skills: data, loading: false });
    } catch (error) {
      toast.error('Could not fetch skills.');
      set({ loading: false });
    }
  },

  // Fetches a single skill by its ID
  fetchSkillById: async (id) => {
    set({ loading: true, skill: null });
    try {
      const { data } = await api.get(`/skills/${id}`);
      set({ skill: data, loading: false });
    } catch (error) {
      toast.error('Could not fetch skill details.');
      set({ loading: false });
    }
  },
  
  // Fetches only the skills belonging to the logged-in Guru
  fetchMySkills: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/skills/my-skills');
      set({ mySkills: data, loading: false });
    } catch (error) {
      toast.error("Could not fetch your skills.");
      set({ loading: false });
    }
  },

  // Creates a new skill
  createSkill: async (skillFormData) => {
    set({ loading: true });
    console.log("Creating skill with data:", skillFormData);
    try {
      const { data } = await api.post('/skills', skillFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Skill created:", data);
      toast.success('Skill created successfully!');
      set((state) => ({ 
        mySkills: [data, ...state.mySkills], 
        loading: false 
      }));
      return data;
    } catch (error) {
      console.log("Error creating skill:", error.message);
      toast.error(error.response?.data?.message || 'Failed to create skill.');
      set({ loading: false });
      return null;
    }
  },

  // Updates an existing skill
  updateSkill: async (skillId, skillFormData) => {
    set({ loading: true });
    try {
      const { data: updatedSkill } = await api.put(`/skills/${skillId}`, skillFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Skill updated successfully!');
      set((state) => ({
        mySkills: state.mySkills.map((skill) =>
          skill._id === skillId ? updatedSkill : skill
        ),
        loading: false,
      }));
      return updatedSkill;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update skill.');
      set({ loading: false });
      return null;
    }
  },

  // Deletes a skill
  deleteSkill: async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`);
      toast.success('Skill deleted successfully!');
      set((state) => ({
        mySkills: state.mySkills.filter((skill) => skill._id !== skillId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete skill.');
    }
  },
}));

export default useSkillStore;