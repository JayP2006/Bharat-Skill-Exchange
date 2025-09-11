const Skill = require('../models/Skill');


exports.getAllSkills = async (req, res, next) => {
  try {
    const { search, lat, lng, radius } = req.query;
    let query = {};

    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const searchRadius = parseFloat(radius) || 10; 
      const earthRadiusKm = 6378.1;
      const radiusInRadians = searchRadius / earthRadiusKm;

      query.location = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians]
        }
      };
      query.mode = 'Offline'; 
    }

    const skills = await Skill.find(query).populate('guru', 'name avatar');
    
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    next(error);
  }
};


exports.createSkill = async (req, res, next) => {
  try {
    const { title, description, tags, hourlyRate, mode, coordinates, address } = req.body;
    console.log("Creating skill with data:", req.user);
    const newSkill = {
      guru: req.user.id,
      title, description, tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      hourlyRate, mode,
      media: req.files ? req.files.map(file => file.path) : [],
    };
    if (mode === 'Offline' && coordinates) {
      newSkill.location = {
        type: 'Point',
        coordinates: coordinates.split(',').map(coord => parseFloat(coord)),
        address
      };
    }
    const skill = await Skill.create(newSkill);
    console.log("Skill created successfully:", skill);
    res.status(201).json(skill);
  } catch (error) {
    console.log("Error creating skill:", error);
    next(error);
  }
};


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


exports.getMySkills = async (req, res, next) => {
    try {
        const skills = await Skill.find({ guru: req.user.id });
        res.status(200).json(skills);
    } catch (error) {
        console.error("Error fetching user's skills:", error);
        next(error);
    }
};


exports.updateSkill = async (req, res, next) => {
    try {
        
        const skill = await Skill.findById(req.params.id);
        console.log("Skill found for update:", skill);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        if (skill.guru.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        const updateData = { ...req.body };
        
      
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
        }

       
        if (req.files && req.files.length > 0) {
            updateData.media = req.files.map(file => file.path);
        }

        
        if (updateData.mode === 'Offline' && updateData.coordinates) {
          updateData.location = {
            type: 'Point',
            coordinates: updateData.coordinates.split(',').map(coord => parseFloat(coord)),
            address: updateData.address
          };
        } else if (updateData.mode === 'Online') {
          
          updateData.location = undefined;
        }

        
        const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.id,
    { $set: updateData, $unset: updateData.location === undefined ? { location: "" } : {} },
    { new: true, runValidators: true }
);

        console.log("Skill updated successfully:", updatedSkill);
        
        res.status(200).json(updatedSkill);
    } catch (error) {
        console.error("Error updating skill:", error);
        next(error);
    }
};


exports.deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        if (skill.guru.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
        await skill.deleteOne();
        res.status(200).json({ message: 'Skill removed' });
    } catch (error) {
        next(error);
    }
};

