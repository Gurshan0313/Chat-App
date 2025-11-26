import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import RoomList from './RoomList';
import UserList from './UserList';
import Message from './Message';
import ChatInput from './ChatInput';
import { Users, Hash } from 'lucide-react';
import './Chat.css';

function Chat({ user }) {
  const { socket } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      if (message.room === currentRoom?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('userStatusChange', (data) => {
      setOnlineUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== data.userId);
        if (data.isOnline) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    socket.on('userTyping', (data) => {
      if (data.roomId === currentRoom?._id) {
        setTypingUsers((prev) => {
          if (!prev.find((u) => u.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        });
      }
    });

    socket.on('userStopTyping', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    return () => {
      socket.off('newMessage');
      socket.off('userStatusChange');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [socket, currentRoom]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
      if (response.data.length > 0 && !currentRoom) {
        handleRoomSelect(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleRoomSelect = async (room) => {
    if (currentRoom?._id === room._id) return;

    if (currentRoom && socket) {
      socket.emit('leaveRoom', currentRoom._id);
    }

    setCurrentRoom(room);
    setMessages([]);
    setTypingUsers([]);

    if (socket) {
      socket.emit('joinRoom', room._id);
    }

    try {
      const response = await axios.get(`/api/messages/${room._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleCreateRoom = async (roomName) => {
    try {
      const response = await axios.post('/api/rooms', {
        name: roomName,
        description: ''
      });
      setRooms((prev) => [response.data, ...prev]);
      handleRoomSelect(response.data);
    } catch (error) {
      console.error('Error creating room:', error);
      alert(error.response?.data?.message || 'Failed to create room');
    }
  };

  const handleSendMessage = (content) => {
    if (socket && currentRoom && content.trim()) {
      socket.emit('sendMessage', {
        content: content.trim(),
        roomId: currentRoom._id
      });
    }
  };

  const handleTyping = () => {
    if (socket && currentRoom) {
      socket.emit('typing', { roomId: currentRoom._id });
    }
  };

  const handleStopTyping = () => {
    if (socket && currentRoom) {
      socket.emit('stopTyping', { roomId: currentRoom._id });
    }
  };

  return (
    <div className="chat-container">
      <RoomList
        rooms={rooms}
        currentRoom={currentRoom}
        onRoomSelect={handleRoomSelect}
        onCreateRoom={handleCreateRoom}
      />

      <div className="chat-main">
        {currentRoom ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <Hash size={24} />
                <div>
                  <h2>{currentRoom.name}</h2>
                  {currentRoom.description && (
                    <p className="room-description">{currentRoom.description}</p>
                  )}
                </div>
              </div>
              <button 
                className="toggle-users-btn"
                onClick={() => setShowUserList(!showUserList)}
              >
                <Users size={20} />
              </button>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <Hash size={48} />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <Message
                    key={message._id}
                    message={message}
                    isOwnMessage={message.sender._id === user._id}
                  />
                ))
              )}
              {typingUsers.length > 0 && (
                <div className="typing-indicator">
                  <span>{typingUsers[0].username} is typing</span>
                  <span className="typing-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              )}
            </div>

            <ChatInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <div className="no-room-selected">
            <Hash size={64} />
            <p>Select a room to start chatting</p>
          </div>
        )}
      </div>

      {showUserList && (
        <UserList 
          onlineUsers={onlineUsers}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default Chat;