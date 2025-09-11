const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  shishya: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.ObjectId, ref: 'Skill' },
  workshop: { type: mongoose.Schema.ObjectId, ref: 'Workshop' },
  issueDate: { type: Date, default: Date.now },
  certificateUrl: { type: String, required: true },
  verificationCode: { type: String, required: true, unique: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);