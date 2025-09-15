import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '@/store/authStore';
import useMessageStore from '@/store/messageStore';
import { create } from 'zustand';


const useSocketStore = create((set) => ({
  socket: null,
  connect: (userId) => {
   
    if (useSocketStore.getState().socket) {
      return;
    }

    const newSocket = io('https://shikshamudra.onrender.com');
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


export const useSocket = () => {
  const { user } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (user) {
      connect(user._id);
    }


    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);
};

export default useSocketStore;
