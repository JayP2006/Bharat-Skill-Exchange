const express = require('express');
const { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill, getSkillsInRadius } = require('../controllers/skillController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.route('/')
  .post(protect, authorize('Guru'), upload.array('media', 5), createSkill)
  .get(getAllSkills);

router.route('/:id')
  .get(getSkillById)
  .put(protect, authorize('Guru'), updateSkill)
  .delete(protect, authorize('Guru'), deleteSkill);
  
router.get('/nearby/:longitude/:latitude/:distance', getSkillsInRadius);

module.exports = router;