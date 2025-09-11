const Certificate = require('../models/Certificate');
const crypto = require('crypto');


exports.issueCertificate = async (req, res, next) => {
  try {
    const { shishya, skill, workshop } = req.body;
    
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