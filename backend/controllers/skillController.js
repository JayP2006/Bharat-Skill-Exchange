const Skill = require('../models/Skill');

// Create a new skill (Guru only)
exports.createSkill = async (req, res, next) => {
  try {
    const { title, description, tags, hourlyRate, mode, coordinates, address } = req.body;
    
    const newSkill = {
      guru: req.user.id,
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      hourlyRate,
      mode,
      media: req.files ? req.files.map(file => file.path) : [],
    };
    
    if (mode === 'Offline' && coordinates) {
        newSkill.location = {
            type: 'Point',
            coordinates: coordinates.split(',').map(coord => parseFloat(coord)), // [long, lat]
            address
        };
    }

    const skill = await Skill.create(newSkill);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

// Get all skills with filtering
exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().populate('guru', 'name avatar');
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};

// Get skills near a location
exports.getSkillsInRadius = async (req, res, next) => {
  try {
    const { longitude, latitude, distance } = req.params;
    
    // distance in kilometers
    const radius = distance / 6378.1; // Earth radius in km
    
    const skills = await Skill.find({
      mode: 'Offline',
      location: {
        $geoWithin: { $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radius] }
      }
    }).populate('guru', 'name avatar');
    
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};

// Get a single skill by ID
exports.getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('guru', 'name avatar bio');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    next(error);
  }
};

// Update a skill
exports.updateSkill = async (req, res, next) => {
    try {
        let skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        // Check if user is the owner
        if (skill.guru.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(skill);
    } catch (error) {
        next(error);
    }
};

// Delete a skill
exports.deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        if (skill.guru.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await skill.deleteOne();
        res.status(200).json({ message: 'Skill removed' });
    } catch (error) {
        next(error);
    }
};