const express = require('express');
const { issueCertificate } = require('../controllers/certificateController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const router = express.Router();

router.post('/issue', protect, authorize('Guru'), issueCertificate);


module.exports = router;