const User = require('../models/User');

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

