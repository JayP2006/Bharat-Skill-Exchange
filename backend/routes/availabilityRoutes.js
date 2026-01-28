const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { saveAvailability, getAvailability } = require('../controllers/availabilityController');

router.post('/', protect, saveAvailability);
router.get('/:guruId', getAvailability);

module.exports = router;
