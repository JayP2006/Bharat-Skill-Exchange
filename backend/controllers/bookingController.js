const Booking = require('../models/Booking');
const Skill = require('../models/Skill');
// const { createOrder } = require('../utils/payments');


exports.createBooking = async (req, res) => {
  try {
    const { skillId, date, time } = req.body;

    const skill = await Skill.findById(skillId).populate('guru');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const scheduledAt = new Date(`${date}T${time}`);
    const day = scheduledAt
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toUpperCase();


    const availability = await GuruAvailability.findOne({
      guru: skill.guru._id,
      day,
    });

    let status = 'REQUESTED';

    if (availability) {
      const slotStart = new Date(`${date}T${availability.startTime}`);
      const slotEnd = new Date(`${date}T${availability.endTime}`);

      const isWithinSlot =
        scheduledAt >= slotStart && scheduledAt < slotEnd;

      if (isWithinSlot) {
        const existingCount = await Booking.countDocuments({
          guru: skill.guru._id,
          status: 'SCHEDULED',
          scheduledAt: {
            $gte: slotStart,
            $lt: slotEnd,
          },
        });

        if (existingCount < availability.maxStudents) {
          status = 'SCHEDULED';
        }
      }
    }

    const booking = await Booking.create({
      learner: req.user._id,
      guru: skill.guru._id,
      skill: skill._id,
      scheduledAt,
      status,
      durationInMinutes: 60,
    });

  
    let session = null;
    if (status === 'SCHEDULED') {
      session = await SessionRequest.create({
        booking: booking._id,
        sender: booking.learner,
        receiver: booking.guru,
        skillName: skill.title,
        requestedDate: scheduledAt,
        status: 'scheduled',
      });
    }

    res.status(201).json({
      booking,
      session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPaymentAndUpdateBooking = async (req, res, next) => {
    res.status(200).json({ message: "Verification not needed for direct booking." });
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ learner: req.user.id })
      .populate('guru', 'name avatar')
      .populate('skill', 'title')
      .sort({ createdAt: -1 })
      .lean(); 

    const bookingIds = bookings.map(b => b._id);

    const sessions = await SessionRequest.find({
      booking: { $in: bookingIds }
    });

    const sessionMap = {};
    sessions.forEach(s => {
      sessionMap[s.booking.toString()] = s.meetingLink;
    });

    const finalBookings = bookings.map(b => ({
      ...b,
      meetingLink: sessionMap[b._id.toString()] || null
    }));

    res.json({ bookings: finalBookings });
  } catch (error) {
    next(error);
  }
};

exports.getGuruBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guru: req.user.id })
      .populate('learner', 'name avatar')
      .populate('skill', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const bookingIds = bookings.map(b => b._id);

    const sessions = await SessionRequest.find({
      booking: { $in: bookingIds }
    });

    const sessionMap = {};
    sessions.forEach(s => {
      sessionMap[s.booking.toString()] = s.meetingLink;
    });

    const finalBookings = bookings.map(b => ({
      ...b,
      meetingLink: sessionMap[b._id.toString()] || null
    }));

    res.json({ bookings: finalBookings });
  } catch (error) {
    next(error);
  }
};

const SessionRequest = require('../models/SessionRequest');
const GuruAvailability = require('../models/GuruAvailability');


exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('learner')
      .populate('guru')
      .populate('skill');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

 
    if (booking.guru._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'ACCEPTED';
    await booking.save();

    const session = await SessionRequest.create({
      booking: booking._id,         
      sender: booking.learner._id,   
      receiver: booking.guru._id,    
      skillName: booking.skill.title,
      status: 'scheduled',         
      requestedDate: booking.scheduledAt,
    });

    res.json({
      success: true,
      booking,
      session,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.scheduleBooking = async (req, res) => {
  const { scheduledAt, durationInMinutes } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking.status !== "ACCEPTED") {
    return res
      .status(400)
      .json({ message: "Booking must be accepted first" });
  }

  booking.scheduledAt = scheduledAt;
  booking.durationInMinutes = durationInMinutes;
  booking.status = "SCHEDULED";

  await booking.save();
  res.json(booking);
};
exports.completeBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking.status !== "SCHEDULED") {
    return res
      .status(400)
      .json({ message: "Only scheduled bookings can be completed" });
  }

  booking.status = "COMPLETED";
  await booking.save();

  res.json(booking);
};
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking.status === "COMPLETED") {
    return res
      .status(400)
      .json({ message: "Completed bookings cannot be cancelled" });
  }

  booking.status = "CANCELLED";
  booking.cancelReason = req.body.reason || "Cancelled by user";

  await booking.save();
  res.json(booking);
};
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.status !== "SCHEDULED") {
      return res.status(400).json({ message: "Only scheduled bookings can be completed" });
    }

    booking.status = "COMPLETED";
    await booking.save();

    const session = await SessionRequest.findOne({ booking: booking._id });
    if (session) {
      session.status = 'completed';
      await session.save();

      const guru = await User.findById(booking.guru);
      guru.walletBalance += 1;
      await guru.save();
    }

    res.json({ success: true, message: "Booking and Session completed successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

