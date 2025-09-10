const Booking = require('../models/Booking');
const { createOrder } = require('../utils/payments');

exports.createBooking = async (req, res, next) => {
  const { guru, skill, startTime, endTime, totalAmount } = req.body;
  try {
    // 1. Create a Razorpay order
    const order = await createOrder(totalAmount * 100, `Booking for skill ${skill}`);
    
    // 2. Create the booking in our DB with status 'Pending'
    const booking = await Booking.create({
      shishya: req.user.id,
      guru,
      skill,
      startTime,
      endTime,
      totalAmount,
      paymentDetails: {
        razorpayOrderId: order.id,
        paymentStatus: 'Pending',
      }
    });

    res.status(201).json({
        booking,
        razorpayOrderId: order.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: order.amount
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPaymentAndUpdateBooking = async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { id: bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Logic to verify signature (from payments.js)
        const { isSignatureValid } = require('../utils/payments');
        if (isSignatureValid(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            booking.paymentDetails.razorpayPaymentId = razorpay_payment_id;
            booking.paymentDetails.paymentStatus = 'Completed';
            booking.status = 'Confirmed';
            await booking.save();
            
            // Emit socket event to notify Guru
            const io = req.app.get('io');
            io.to(booking.guru.toString()).emit('new_booking', booking);

            res.status(200).json({ message: 'Payment successful and booking confirmed' });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        next(error);
    }
};

// Other controller functions (get bookings, etc.) can be added here
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ shishya: req.user.id }).populate('guru skill');
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};