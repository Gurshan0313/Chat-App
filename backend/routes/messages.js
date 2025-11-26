const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get messages for a room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'username isOnline')
      .lean();

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;