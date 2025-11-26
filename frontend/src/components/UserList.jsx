import React from 'react';
import { Users, Circle } from 'lucide-react';
import './UserList.css';

function UserList({ onlineUsers, currentUser }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <Users size={18} />
        <h3>Online Users</h3>
        <span className="user-count">{onlineUsers.length}</span>
      </div>

      <div className="users">
        {onlineUsers.length === 0 ? (
          <div className="no-users">
            <p>No users online</p>
          </div>
        ) : (
          onlineUsers.map((user) => (
            <div 
              key={user.userId} 
              className={`user-item ${user.userId === currentUser._id ? 'current-user' : ''}`}
            >
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.username}
                  {user.userId === currentUser._id && ' (You)'}
                </span>
              </div>
              <Circle 
                size={10} 
                className="online-indicator" 
                fill="currentColor"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;