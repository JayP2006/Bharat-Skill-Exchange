const Message = require('../models/Message');

exports.getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};