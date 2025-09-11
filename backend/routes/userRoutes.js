const express = require('express');

const { getChatContacts } = require('../controllers/userController'); 
const { protect } = require('../middlewares/auth');
const router = express.Router();


router.get('/contacts', protect, getChatContacts);

module.exports = router;
