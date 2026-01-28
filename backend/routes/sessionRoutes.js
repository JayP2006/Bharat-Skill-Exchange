const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

const {
  requestSession,
  acceptSession,
  completeSession,
  getMySessions,
  addMeetingLink,
  getAllUserSessions,
  getUpcomingSessions,   
} = require('../controllers/sessionController');

router.post('/', protect, requestSession);
router.get('/my', protect, getMySessions);

router.put('/:id/accept', protect, acceptSession);
router.put('/:id/complete', protect, completeSession);
router.put('/:id', protect , addMeetingLink);
router.get('/upcoming', protect, getUpcomingSessions);
router.get('/all', protect, getAllUserSessions);
module.exports = router;
