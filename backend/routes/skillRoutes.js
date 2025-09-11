const express = require('express');
// ✅ Add getMySkills to the import list
const { 
    createSkill, 
    getAllSkills, 
    getSkillById, 
    updateSkill, 
    deleteSkill, 
    getMySkills 
} = require('../controllers/skillController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { upload } = require('../config/cloudinary');
const router = express.Router();


router.get('/my-skills', protect, getMySkills);

router.route('/')
  .post(protect, authorize('Guru'), upload.array('media', 5), createSkill)
  .get(getAllSkills);

router.route('/:id')
  .get(getSkillById)
  .put(protect, authorize('Guru'), upload.array('media', 5), updateSkill)
  .delete(protect, authorize('Guru'), deleteSkill);
module.exports = router;