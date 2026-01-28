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


router
  .route('/')
  .post(protect, authorize('Shishya'), createBooking)
  .get(protect, getMyBookings);

router.get('/guru', protect, authorize('Guru'), getGuruBookings);

router.patch('/:id/accept', protect, authorize('Guru'), acceptBooking);

router.patch('/:id/cancel', protect, cancelBooking);

router.patch('/:id/complete', protect, authorize('Guru'), completeBooking);

router.patch('/:id/schedule', protect, authorize('Guru'), scheduleBooking);

router.post(
  '/verify-payment/:id',
  protect,
  verifyPaymentAndUpdateBooking
);

module.exports = router;
