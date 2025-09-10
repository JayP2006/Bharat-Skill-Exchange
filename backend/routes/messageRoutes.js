const express = require('express');
const { getMessages } = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.get('/:receiverId', protect, getMessages);

module.exports = router;