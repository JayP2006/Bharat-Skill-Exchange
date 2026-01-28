const express = require('express');

const { getChatContacts, updateProfile, searchGurus, updateAvatar, getUserById } = require('../controllers/userController'); 
const { protect } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');
const router = express.Router();


router.get('/contacts', protect, getChatContacts);
router.route('/me/update').put(protect, updateProfile);
router.route('/search').get(searchGurus);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/:id', getUserById);
module.exports = router;
