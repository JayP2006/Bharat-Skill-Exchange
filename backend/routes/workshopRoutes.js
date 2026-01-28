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
router.post('/', protect, authorize('Guru'), createWorkshop);
router.get('/student', protect, getStudentWorkshops);
router.post('/:workshopId/join', protect, authorize('Shishya'), joinWorkshop);
router.get('/', getAllWorkshops);
router.get('/skill/:skillId',protect,getWorkshopsBySkill);

module.exports = router;
