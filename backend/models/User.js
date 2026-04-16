const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['Guru', 'Shishya', 'Admin'],
    default: 'Shishya',
  },
   location: {
    type: {
      type: String
    },
    coordinates: {
      type: [Number],
      default: undefined, 
    },
  },

  locationText: { type: String },
  avatar: { type: String, default: 'default_avatar_url' },
  bio: { type: String },
  online: { type: Boolean, default: false },

  // --- ✨ NEW UPGRADE FIELDS ---
  headline: { type: String, trim: true },
  walletBalance: { type: Number, default: 3 }, 
  skillsOffered: [{
    skillName: { type: String },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] }
  }],
  skillsWanted: [{ type: String }],
  timezone: { type: String, default: "Asia/Kolkata" },
  availability: [{
    day: { type: String },
    slots: [String]
  }],

  // Relations (Preserved)
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],

}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
