const User = require('../models/User');
// Booking aur Mongoose ki ab yahan zaroorat nahi hai
// const Booking = require('../models/Booking');
// const mongoose = require('mongoose');

// @desc    Get chat contacts based on user role
// @route   GET /api/users/contacts
// @access  Private
exports.getChatContacts = async (req, res, next) => {
  try {
    const currentUser = req.user;
    let contacts = [];

    if (currentUser.role === 'Shishya') {
      // ✅ LOGIC: Agar aap Shishya hain, to saare Gurus ko dhoondhe.
      // Unke role ko bhi select karein taaki UI mein dikha sakein.
      contacts = await User.find({ role: 'Guru' }).select('name avatar role');
    } 
    else if (currentUser.role === 'Guru') {
      // ✅ LOGIC: Agar aap Guru hain, to saare Shishyas ko dhoondhe.
      // Unke role ko bhi select karein.
      contacts = await User.find({ role: 'Shishya' }).select('name avatar role');
    }

    // Apne aap ko contact list se hamesha hata dein.
    const filteredContacts = contacts.filter(contact => contact._id.toString() !== currentUser.id.toString());

    res.status(200).json(filteredContacts);
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    next(error);
  }
};

