const express = require('express');
const { createBooking, verifyPaymentAndUpdateBooking, getMyBookings, getGuruBookings } = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const router = express.Router();

router.route('/')
  .post(protect, authorize('Shishya'), createBooking)
  .get(protect, getMyBookings);

router.post('/verify-payment/:id', protect, verifyPaymentAndUpdateBooking);
router.get('/guru',protect,getGuruBookings)
module.exports = router;