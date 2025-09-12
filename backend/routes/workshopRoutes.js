const express = require('express');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const {
  createWorkshop,
  getAllWorkshops,
  getStudentWorkshops,
  joinWorkshop,
  getWorkshopsBySkill
} = require('../controllers/workshopController');

const router = express.Router();

// Guru routes
router.post('/', protect, authorize('Guru'), createWorkshop);

// Student routes
router.get('/student', protect, getStudentWorkshops);
router.post('/:workshopId/join', protect, authorize('Shishya'), joinWorkshop);

// Public routes
router.get('/', getAllWorkshops);
router.get('/skill/:skillId',protect,getWorkshopsBySkill);

module.exports = router;
