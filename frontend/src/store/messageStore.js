import { create } from 'zustand';
import api from '@/utils/api';
import useSocketStore from '@/hooks/useSocket';
import toast from 'react-hot-toast';

const useMessageStore = create((set, get) => ({
  conversations: [], 
  messages: [],
  activeConversation: null,
  loading: false,
contacts: [], 
  messages: [],
  activeConversation: null,
  loading: false,

  // 👇 ADD THIS NEW FUNCTION
  fetchContacts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/users/contacts');
      set({ contacts: data, loading: false });
    } catch (error) {
      toast.error("Failed to fetch contacts.");
      set({ loading: false });
    }
  },

  setActiveConversation: (userId) => {
    if (get().activeConversation !== userId) {
        set({ activeConversation: userId, messages: [] });
        get().getMessages(userId);
    }
  },
  
  getMessages: async (receiverId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/messages/${receiverId}`);
      set({ messages: data, loading: false });
    } catch (error) {
      toast.error("Failed to load messages.");
      set({ loading: false });
    }
  },

  sendMessage: (messageData) => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.emit('send_message', messageData);
      // Optimistically update UI
      set((state) => ({
        messages: [...state.messages, { ...messageData, _id: Date.now(), createdAt: new Date().toISOString() }]
      }));
    } else {
      toast.error("Not connected to chat. Please refresh.");
    }
  },

  addReceivedMessage: (message) => {
    const activeConv = get().activeConversation;
    // Only add the message if it belongs to the currently active conversation
    if (message.sender === activeConv) {
      set((state) => ({
        messages: [...state.messages, message]
      }));
    } else {
      // Notify user of a new message from someone else
      toast(`New message from another user!`, { icon: '📬' });
    }
  }
}));

export default useMessageStore;