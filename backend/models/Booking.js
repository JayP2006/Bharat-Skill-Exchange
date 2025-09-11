const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  shishya: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.ObjectId, ref: 'Skill', required: true },
  workshop: { type: mongoose.Schema.ObjectId, ref: 'Workshop' }, // Optional
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentStatus: { type: String, default: 'Pending' },
    
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);