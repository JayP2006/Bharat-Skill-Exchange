const GuruAvailability = require('../models/GuruAvailability');

exports.saveAvailability = async (req, res) => {
  const { slots, maxStudents } = req.body;

  try {
    const availability = await GuruAvailability.findOneAndUpdate(
      { guru: req.user.id },
      {
        slots,
        maxStudents, 
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      availability,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const availability = await GuruAvailability.findOne({
      guru: req.params.guruId,
    });

    res.json({ availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
