const express = require('express');
const { 
  issueCertificate, 
  getMyCertificates, 
  downloadCertificate 
} = require('../controllers/certificateController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

const router = express.Router();

router.post('/issue', protect, authorize('Guru'), issueCertificate);

router.get('/my-certificates', protect, getMyCertificates);

router.get('/:id/download', protect, downloadCertificate);

module.exports = router;