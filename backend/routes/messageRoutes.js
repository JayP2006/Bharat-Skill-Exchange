const express = require('express');
const { 
  sendMessage, 
  getMessages, 
  getConversations, 
  markAsRead 
} = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/', protect, sendMessage);
router.get('/:receiverId', protect, getMessages);
router.put('/:senderId/read', protect, markAsRead);

module.exports = router;