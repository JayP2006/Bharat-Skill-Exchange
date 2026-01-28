const express = require('express');
const { 
  issueCertificate, 
  getMyCertificates, 
  downloadCertificate 
} = require('../controllers/certificateController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

const router = express.Router();

// Guru issues certificate
router.post('/issue', protect, authorize('Guru'), issueCertificate);

// Student views their certificates
router.get('/my-certificates', protect, getMyCertificates);

// Download PDF (Public or Protected, usually Protected)
router.get('/:id/download', protect, downloadCertificate);

module.exports = router;