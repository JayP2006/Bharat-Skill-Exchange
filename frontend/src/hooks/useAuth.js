import useAuthStore from '@/store/authStore';

// This is a convenience hook for accessing the Zustand store.
const useAuth = () => {
  return useAuthStore();
};

export default useAuth;