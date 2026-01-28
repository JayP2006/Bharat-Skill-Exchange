const express = require('express');
const router = express.Router();

const {
  createBooking,
  verifyPaymentAndUpdateBooking,
  getMyBookings,
  getGuruBookings,
  acceptBooking,
  cancelBooking,
  completeBooking,
  scheduleBooking,
} = require('../controllers/bookingController');

const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

// --------------------
// Learner routes
// --------------------
router
  .route('/')
  .post(protect, authorize('Shishya'), createBooking)
  .get(protect, getMyBookings);

// --------------------
// Guru routes
// --------------------
router.get('/guru', protect, authorize('Guru'), getGuruBookings);

// --------------------
// Booking lifecycle actions
// --------------------
router.patch('/:id/accept', protect, authorize('Guru'), acceptBooking);

router.patch('/:id/cancel', protect, cancelBooking);

router.patch('/:id/complete', protect, authorize('Guru'), completeBooking);

router.patch('/:id/schedule', protect, authorize('Guru'), scheduleBooking);

// --------------------
// (Optional) Payment verify
// --------------------
router.post(
  '/verify-payment/:id',
  protect,
  verifyPaymentAndUpdateBooking
);

module.exports = router;
