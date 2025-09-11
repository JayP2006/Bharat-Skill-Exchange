const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  hourlyRate: { type: Number, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
  media: [{ type: String }], 
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], 
    },
    address: String,
  },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });


SkillSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Skill', SkillSchema);