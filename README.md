# Real-Time Chat Application 💬

A full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB.

## Features ✨

- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Multiple Channels**: Create and join different chat rooms
- **Online Status**: See who's currently online with live status indicators
- **Message History**: Persistent message storage in MongoDB
- **Typing Indicators**: See when other users are typing
- **User Authentication**: Secure registration and login with JWT
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack 🛠️

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Socket.io Client
- Axios for HTTP requests
- Lucide React for icons
- CSS3 with modern styling

## Prerequisites 📋

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation & Setup 🚀

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chat-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a strong random string in production.

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB

If using local MongoDB:

```bash
mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in your server `.env` file.

### 5. Run the Application

**Start the backend server** (from the server directory):

```bash
npm start
# or for development with auto-reload
npm run dev
```

**Start the frontend** (from the client directory):

```bash
npm start
```

The application should now be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage 📱

1. **Register an Account**: Open the app and create a new account
2. **Login**: Sign in with your credentials
3. **Create/Join Channels**: Create new chat channels or join existing ones
4. **Start Chatting**: Send messages in real-time to other online users
5. **See Online Users**: Check the user list to see who's currently online

## Project Structure 📁

```
chat-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Socket context
│   │   ├── App.jsx        # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
│
└── backend/                # Node.js backend
    ├── models/            # MongoDB models
    ├── routes/            # Express routes
    ├── middleware/        # Custom middleware
    ├── config/            # Configuration files
    ├── socket.js          # Socket.io setup
    ├── server.js          # Server entry point
    └── package.json
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Rooms
- `GET /api/rooms` - Get all rooms (requires auth)
- `POST /api/rooms` - Create a new room (requires auth)
- `POST /api/rooms/:roomId/join` - Join a room (requires auth)

### Messages
- `GET /api/messages/:roomId` - Get messages for a room (requires auth)

## Socket Events 🔌

### Client → Server
- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - User started typing
- `stopTyping` - User stopped typing

### Server → Client
- `newMessage` - New message received
- `userStatusChange` - User online/offline status changed
- `userTyping` - User is typing
- `userStopTyping` - User stopped typing

## Security Considerations 🔒

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected API routes with middleware
- Socket connections authenticated via JWT
- Input validation using express-validator

## Future Enhancements 🚀

- [ ] Direct messaging between users
- [ ] File/image sharing
- [ ] Message reactions and emojis
- [ ] User profiles with avatars
- [ ] Message editing and deletion
- [ ] Push notifications
- [ ] Voice/video calling
- [ ] Message search functionality
- [ ] Dark/light theme toggle

## Troubleshooting 🔧

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in the `.env` file
- Verify network connectivity if using MongoDB Atlas

### Socket Connection Issues
- Check that both frontend and backend are running
- Verify the `REACT_APP_SOCKET_URL` matches your backend URL
- Check browser console for CORS errors

### Port Already in Use
- Change the PORT in server `.env`
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Contact 📧

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using React, Node.js, Socket.io, and MongoDB