import React from 'react';
import './Message.css';

function Message({ message, isOwnMessage }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.messageType === 'system') {
    return (
      <div className="system-message">
        <span>{message.content}</span>
      </div>
    );
  }

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : ''}`}>
      <div className="message-avatar">
        {message.sender.username.charAt(0).toUpperCase()}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{message.sender.username}</span>
          <span className="message-time">{formatTime(message.createdAt)}</span>
        </div>
        <div className="message-text">
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default Message;