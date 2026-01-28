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

// Get Average Rating (For Dashboard)
router.get('/my-rating', protect, authorize('Guru'), getGuruAverageRating);

// Get Reviews for a specific user (For Profile Page)
router.get('/user/:userId', getUserReviews);

// Create Review (Specific Booking ID in URL)
router.post('/booking/:bookingId', protect, authorize('Shishya'), createReview);

// Get Reviews for a Skill
router.get('/skill/:skillId', getReviewsForSkill);

module.exports = router;