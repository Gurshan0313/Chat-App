const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find().populate('createdBy', 'username').sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    // Check if room exists
    let room = await Room.findOne({ name });
    if (room) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    room = new Room({
      name,
      description,
      isPrivate: isPrivate || false,
      createdBy: req.userId,
      members: [req.userId]
    });

    await room.save();
    await room.populate('createdBy', 'username');

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join room
router.post('/:roomId/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }

    res.json(room);
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;