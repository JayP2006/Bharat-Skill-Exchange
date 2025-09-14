import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import useSocketStore from '@/hooks/useSocket';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role',data.role);
      set({ token: data.token });
      await get().loadUser();
      toast.success('Successfully logged in!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      set({ loading: false });
      return false;
    }
  },

  signup: async (userData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      set({ token: data.token });
      await get().loadUser();
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      set({ loading: false });
      return false;
    }
  },

  
logout: () => {
  localStorage.removeItem('token');
  
  useSocketStore.getState().disconnect(); 
  
  set({ user: null, token: null, loading: false });
  toast.success('Logged out.');
},
  loadUser: async () => {
    const token = get().token;
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        set({ user: data, loading: false });
      } catch (error) {
        get().logout();
      }
    } else {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;