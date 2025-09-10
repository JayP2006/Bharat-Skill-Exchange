const Workshop = require('../models/Workshop');

exports.createWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.create({ ...req.body, guru: req.user.id });
    res.status(201).json(workshop);
  } catch (error) {
    next(error);
  }
};

exports.getAllWorkshops = async (req, res, next) => {
    try {
        const workshops = await Workshop.find().populate('guru', 'name').populate('skill', 'title');
        res.status(200).json(workshops);
    } catch (error) {
        next(error);
    }
};
// Add booking logic similar to skill booking