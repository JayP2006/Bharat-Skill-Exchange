const Workshop = require('../models/Workshop');
const User = require('../models/User');

// Guru creates workshop
exports.createWorkshop = async (req, res, next) => {
  try {
    // 1️⃣ Create workshop
    let workshop = await Workshop.create({
      ...req.body,
      guru: req.user.id
    });

    // 2️⃣ Populate fields
    await workshop.populate([
      { path: 'guru', select: 'name avatar' },
      { path: 'skill', select: 'title hourlyRate mode' }
    ]);

    // 3️⃣ Send response
    res.status(201).json(workshop);
  } catch (error) {
    console.log("CREATE WORKSHOP ERROR:", error);
    next(error);
  }
};

// Get all workshops (public)
exports.getAllWorkshops = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.skill) {
      filter.skill = new mongoose.Types.ObjectId(req.query.skill);
    }

    const workshops = await Workshop.find(filter)
      .populate('guru', 'name avatar')
      .populate('skill', 'title hourlyRate mode');

    res.status(200).json(workshops);
  } catch (error) {
    next(error);
  }
};


// Get workshops for student (only enrolled skills)
exports.getStudentWorkshops = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student.enrolledSkills || student.enrolledSkills.length === 0)
      return res.status(200).json([]);

    const workshops = await Workshop.find({ skill: { $in: student.enrolledSkills } })
  .populate('guru', 'name avatar')
  .populate('skill', 'title hourlyRate mode');
    res.status(200).json(workshops);
  } catch (error) {
    next(error);
  }
};

// Student joins a workshop
exports.joinWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId);
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });

    if (workshop.seatsBooked >= workshop.seatLimit)
      return res.status(400).json({ message: "Workshop full" });

    workshop.seatsBooked += 1;
    await workshop.save();

    res.status(200).json({ message: "Joined workshop successfully", workshop });
  } catch (error) {
    next(error);
  }
};
// ... other code in your controller

const mongoose = require('mongoose'); // <-- Make sure mongoose is imported at the top

exports.getWorkshopsBySkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    console.log(`--- BACKEND HIT with skillId: ${skillId} ---`);

    // Check if the provided skillId is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      console.log("Invalid ObjectId format provided.");
      return res.status(400).json({ message: "Invalid Skill ID format" });
    }

    // Convert the string ID to a Mongoose ObjectId
    const skillObjectId = new mongoose.Types.ObjectId(skillId);

    console.log(`Searching for workshops with skill ObjectId: ${skillObjectId}`);

    const workshops = await Workshop.find({ skill: skillObjectId })
      .populate('guru', 'name avatar')
      .populate('skill', 'title');

    console.log(`Database query found ${workshops.length} workshops.`);
    
    res.status(200).json(workshops);

  } catch (error) {
    console.error("ERROR IN getWorkshopsBySkill:", error);
    next(error);
  }
};