const Booking = require('../models/Booking');
const SessionRequest = require('../models/SessionRequest');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

/**
 * SHISHYA → Request Session
 */
exports.requestSession = async (req, res) => {
  const { receiverId, skillName, requestedDate } = req.body;

  try {
    const sender = await User.findById(req.user.id);

    if (sender.walletBalance < 1) {
      return res.status(400).json({ message: 'Insufficient Credits' });
    }

    // Hold credit
    sender.walletBalance -= 1;
    await sender.save();

    const session = await SessionRequest.create({
      sender: req.user.id,
      receiver: receiverId,
      skillName,
      requestedDate,
      status: 'pending',
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GURU → Accept + Schedule Session
 */
exports.acceptSession = async (req, res) => {
  try {
    const session = await SessionRequest.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'scheduled';
    session.meetingLink = `https://meet.jit.si/${uuidv4()}`;

    await session.save();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GURU → Complete Session
 */
exports.completeSession = async (req, res) => {
  try {
    const session = await SessionRequest.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.status !== 'scheduled') {
      return res.status(400).json({ message: 'Session not scheduled' });
    }

    session.status = 'completed';
    await session.save();

    // Credit Guru
    const guru = await User.findById(session.receiver);
    guru.walletBalance += 1;
    await guru.save();

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * MY SESSIONS (Guru + Shishya)
 */
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await SessionRequest.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ requestedDate: 1 });

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * GURU → Add / Update Meeting Link
 */
exports.addMeetingLink = async (req, res) => {
  const { meetingLink } = req.body;
  console.log(req.params.id, meetingLink);
  try {
    const session = await SessionRequest.findOne({
      booking: req.params.id, // 👈 bookingId
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (session.status !== 'scheduled') {
      return res.status(400).json({ message: 'Session not scheduled' });
    }

    session.meetingLink = meetingLink;
    await session.save();

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getUpcomingSessions = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware provides this

    // Find sessions where the user is either sender or receiver
    // AND status is 'scheduled'
    // AND requestedDate is greater than now
    const sessions = await SessionRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'scheduled',
      requestedDate: { $gt: new Date() }
    })
    .populate('booking')
    .sort({ requestedDate: 1 }); // Sort by soonest first

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await SessionRequest.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('booking').sort({ createdAt: -1 });

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};exports.getSessionsByFilter = async (req, res) => {
  try {
    const userId = req.user._id;
    const { filter } = req.query; // 'all' or 'upcoming'
    
    let query = {
      $or: [{ sender: userId }, { receiver: userId }]
    };

    // Agar filter 'upcoming' hai, toh sirf scheduled aur future sessions dikhayein
    if (filter === 'upcoming') {
      query.status = 'scheduled';
      query.requestedDate = { $gt: new Date() };
    }

    const sessions = await SessionRequest.find(query)
      .populate('sender receiver', 'name avatar')
      .populate('booking')
      .sort({ requestedDate: 1 });

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
