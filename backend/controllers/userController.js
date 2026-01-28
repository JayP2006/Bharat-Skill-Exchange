const User = require('../models/User');
const axios = require('axios');
exports.getChatContacts = async (req, res, next) => {
  try {
    const currentUser = req.user;
    let contacts = [];

    if (currentUser.role === 'Shishya') {
      contacts = await User.find({ role: 'Guru' }).select('name avatar role');
    } 
    else if (currentUser.role === 'Guru') {
      contacts = await User.find({ role: 'Shishya' }).select('name avatar role');
    }

    const filteredContacts = contacts.filter(contact => contact._id.toString() !== currentUser.id.toString());

    res.status(200).json(filteredContacts);
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    next(error);
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, title, skills, location, coordinates } = req.body;

    const updateData = {
      name,
      bio,
      headline: title,
    };

    if (Array.isArray(skills)) {
      updateData.skillsOffered = skills.map(skill => ({
        skillName: skill,
        proficiency: 'Beginner',
      }));
    }

    if (
      coordinates &&
      typeof coordinates.lat === 'number' &&
      typeof coordinates.lng === 'number'
    ) {

      const geoRes = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat: coordinates.lat,
            lon: coordinates.lng,
            format: 'json',
          },
          headers: {
            'User-Agent': 'SkillSwap-App',
          },
        }
      );

      const address = geoRes.data.address || {};

      const locationText =
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        'Unknown location';

      updateData.location = {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      };

      updateData.locationText = locationText;
    }

    if (typeof location === 'string' && !coordinates) {
      updateData.locationText = location;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.searchGurus = async (req, res) => {
  const { skill, lat, lng } = req.query;
  try {
    let query = {}; 

    if (skill) {
      query['skillsOffered.skillName'] = { $regex: skill, $options: 'i' };
    }

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 10000 // 10km radius
        }
      };
    }

    const users = await User.find(query).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path }, // 👈 Cloudinary URL
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();

    if (userObj.location && typeof userObj.location === 'object') {
      userObj.location = 'Online';
    }

    res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
