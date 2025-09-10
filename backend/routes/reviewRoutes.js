const express = require('express');
const { createReview, getReviewsForSkill } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const router = express.Router();

router.post('/', protect, authorize('Shishya'), createReview);
router.get('/skill/:skillId', getReviewsForSkill);

module.exports = router;