const Message = require('../models/Message');
const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');



exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content are required" });
    }

    // 🔥 FIX: Changed 'user' to 'learner' to match your Database Schema
    const activeBooking = await Booking.findOne({
      $or: [
        // Case 1: Sender is the Student (Learner), Receiver is the Guru
        { learner: senderId, guru: receiverId }, 
        
        // Case 2: Sender is the Guru, Receiver is the Student (Learner)
        { learner: receiverId, guru: senderId }
      ],
      // Checking for all valid statuses where chat should be allowed
      status: { $in: ['ACCEPTED', 'COMPLETED', 'SCHEDULED'] } 
    });

    console.log("Active Booking Found:", activeBooking);

    // If no booking exists with these statuses, Deny access
    if (!activeBooking) {
      return res.status(403).json({ 
        message: "Messaging is only allowed after a Booking is Scheduled or Accepted." 
      });
    }

    // Create Message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content,
      booking: activeBooking._id 
    });

    // Populate sender details for frontend return
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

// ... (Keep the rest of the controller functions like getMessages, getConversations exactly the same) ...

exports.getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: receiverId },
        { sender: receiverId, receiver: myId },
      ],
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$receiver", new mongoose.Types.ObjectId(currentUserId)] },
                    { $eq: ["$read", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          user: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            avatar: "$userDetails.avatar",
            role: "$userDetails.role"
          },
          lastMessage: {
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
            isOwn: { $eq: ["$lastMessage.sender", new mongoose.Types.ObjectId(currentUserId)] }
          },
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    const myId = req.user.id;

    await Message.updateMany(
      { sender: senderId, receiver: myId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};