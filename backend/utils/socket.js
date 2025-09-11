const { Server } = require('socket.io');
const Message = require('../models/Message');
const User = require('../models/User');

let onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

   
    socket.on('add_user', async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit('get_online_users', Array.from(onlineUsers.keys()));
      console.log(`User ${userId} is online.`);
    });

    
    socket.on('send_message', async (data) => {
      const { sender, receiver, content } = data;
      const receiverSocketId = onlineUsers.get(receiver);

      const message = await Message.create({ sender, receiver, content });
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
    });
    
    
    socket.on('typing', ({ receiver, isTyping }) => {
        const receiverSocketId = onlineUsers.get(receiver);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('user_typing', { isTyping });
        }
    });

    
    socket.on('webrtc_offer', ({ offer, to }) => {
        const receiverSocketId = onlineUsers.get(to);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('webrtc_offer', { offer, from: socket.id });
        }
    });

    socket.on('webrtc_answer', ({ answer, to }) => {
        const receiverSocketId = onlineUsers.get(to);
         if(receiverSocketId) {
            io.to(receiverSocketId).emit('webrtc_answer', { answer, from: socket.id });
        }
    });

    socket.on('webrtc_ice_candidate', ({ candidate, to }) => {
        const receiverSocketId = onlineUsers.get(to);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('webrtc_ice_candidate', { candidate, from: socket.id });
        }
    });

    
    socket.on('disconnect', () => {
      let userId;
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          userId = key;
          break;
        }
      }
      if (userId) {
        onlineUsers.delete(userId);
        User.findByIdAndUpdate(userId, { online: false }).exec();
        io.emit('get_online_users', Array.from(onlineUsers.keys()));
        console.log(`User ${userId} disconnected.`);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;