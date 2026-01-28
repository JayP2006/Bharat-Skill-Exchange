const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
   booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'completed', 'cancelled'], 
    default: 'pending' 
  },

  requestedDate: { type: Date },
  meetingLink: { type: String, default: "" }, // Video Call Link
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SessionRequest', sessionSchema);