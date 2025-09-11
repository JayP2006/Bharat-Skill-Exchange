const express = require('express');
// getChatContacts ko import karein aur purane wale ko hata dein
const { getChatContacts } = require('../controllers/userController'); 
const { protect } = require('../middlewares/auth');
const router = express.Router();

// Route ko /gurus se /contacts mein badal dein
router.get('/contacts', protect, getChatContacts);

module.exports = router;
