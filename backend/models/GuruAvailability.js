const mongoose = require('mongoose');

const guruAvailabilitySchema = new mongoose.Schema({
  guru: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  slots: [
    {
      day: {
        type: String,
        enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        required: true,
      },
      from: { type: String, required: true }, // "10:00"
      to: { type: String, required: true },   // "18:00"
    },
  ],
  maxStudents: {
    type: Number,
    default: 1, // 🔥 capacity
  },
}, { timestamps: true });

module.exports = mongoose.model('GuruAvailability', guruAvailabilitySchema);
