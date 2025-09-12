const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skill: { type: mongoose.Schema.ObjectId, ref: 'Skill', required: true },
  dateTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  seatLimit: { type: Number, required: true },
  seatsBooked: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  
  // --- Links ---
  liveLink: { type: String, default: null }, // <-- Yahan add karein
  videoUrl: { type: String, default: null }, // <-- Yahan add karein

}, { timestamps: true });

module.exports = mongoose.model('Workshop', WorkshopSchema);
