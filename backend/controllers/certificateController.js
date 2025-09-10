const Certificate = require('../models/Certificate');
const crypto = require('crypto');

// This is a placeholder for actual PDF generation
exports.issueCertificate = async (req, res, next) => {
  try {
    const { shishya, skill, workshop } = req.body;
    // In a real app, you would generate a PDF, upload it to Cloudinary, and get a URL.
    const mockUrl = 'https://res.cloudinary.com/demo/image/upload/sample.pdf';
    const verificationCode = crypto.randomBytes(16).toString('hex');
    
    const certificate = await Certificate.create({
      shishya,
      guru: req.user.id,
      skill,
      workshop,
      certificateUrl: mockUrl,
      verificationCode,
    });

    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
};