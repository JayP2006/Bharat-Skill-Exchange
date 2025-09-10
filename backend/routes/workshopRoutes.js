const express = require('express');
const { createWorkshop, getAllWorkshops } = require('../controllers/workshopController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const router = express.Router();

router.route('/')
    .post(protect, authorize('Guru'), createWorkshop)
    .get(getAllWorkshops);

module.exports = router;