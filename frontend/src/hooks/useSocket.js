import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '@/store/authStore';
import useMessageStore from '@/store/messageStore';
import { create } from 'zustand';

// Store to hold the single socket instance. This is better than managing it in a hook.
const useSocketStore = create((set) => ({
  socket: null,
  connect: (userId) => {
    // Prevent creating multiple connections
    if (useSocketStore.getState().socket) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    set({ socket: newSocket });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('add_user', userId);
    });

    newSocket.on('receive_message', (message) => {
      useMessageStore.getState().addReceivedMessage(message);
    });
  },
  disconnect: () => {
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log('Socket disconnected.');
    }
  },
}));

// This is now a simple hook that uses the store to manage the connection lifecycle.
export const useSocket = () => {
  const { user } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (user) {
      connect(user._id);
    }

    // This cleanup function will run when the user logs out
    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);
};

export default useSocketStore;