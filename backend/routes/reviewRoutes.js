const express = require('express');
const { 
  createReview, 
  getReviewsForSkill, 
  getUserReviews, // New Function for Profile Page
  getGuruAverageRating 
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

const router = express.Router();

router.get('/my-rating', protect, authorize('Guru'), getGuruAverageRating);

router.get('/user/:userId', getUserReviews);

router.post('/booking/:bookingId', protect, authorize('Shishya'), createReview);
router.get('/skill/:skillId', getReviewsForSkill);

module.exports = router;