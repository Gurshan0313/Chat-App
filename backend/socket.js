const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const Room = require('./models/Room');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    try {
      // Update user online status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date()
      });

      const user = await User.findById(socket.userId).select('-password');
      
      // Broadcast user online status
      io.emit('userStatusChange', {
        userId: socket.userId,
        username: user.username,
        isOnline: true
      });

      // Join user to their rooms
      const rooms = await Room.find({ members: socket.userId });
      rooms.forEach(room => {
        socket.join(room._id.toString());
      });

      // Handle joining a room
      socket.on('joinRoom', async (roomId) => {
        try {
          socket.join(roomId);
          
          // Add user to room members if not already there
          const room = await Room.findById(roomId);
          if (room && !room.members.includes(socket.userId)) {
            room.members.push(socket.userId);
            await room.save();
          }

          socket.emit('joinedRoom', roomId);
        } catch (error) {
          console.error('Join room error:', error);
        }
      });

      // Handle leaving a room
      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        socket.emit('leftRoom', roomId);
      });

      // Handle sending a message
      socket.on('sendMessage', async (data) => {
        try {
          const { content, roomId } = data;

          const message = new Message({
            content,
            sender: socket.userId,
            room: roomId,
            messageType: 'text'
          });

          await message.save();
          await message.populate('sender', 'username isOnline');

          // Emit message to all users in the room
          io.to(roomId).emit('newMessage', message);
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('messageError', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicator
      socket.on('typing', (data) => {
        socket.to(data.roomId).emit('userTyping', {
          userId: socket.userId,
          username: user.username,
          roomId: data.roomId
        });
      });

      socket.on('stopTyping', (data) => {
        socket.to(data.roomId).emit('userStopTyping', {
          userId: socket.userId,
          roomId: data.roomId
        });
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.userId}`);
        
        try {
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            socketId: null,
            lastSeen: new Date()
          });

          io.emit('userStatusChange', {
            userId: socket.userId,
            username: user.username,
            isOnline: false
          });
        } catch (error) {
          console.error('Disconnect error:', error);
        }
      });

    } catch (error) {
      console.error('Socket connection error:', error);
    }
  });

  return io;
};

module.exports = setupSocket;