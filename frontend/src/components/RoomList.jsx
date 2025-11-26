import React, { useState } from 'react';
import { Hash, Plus, X } from 'lucide-react';
import './RoomList.css';

function RoomList({ rooms, currentRoom, onRoomSelect, onCreateRoom }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h3>Channels</h3>
        <button 
          className="create-room-btn"
          onClick={() => setShowCreateModal(true)}
          title="Create new room"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="rooms">
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`room-item ${currentRoom?._id === room._id ? 'active' : ''}`}
            onClick={() => onRoomSelect(room)}
          >
            <Hash size={18} />
            <span className="room-name">{room.name}</span>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Channel</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label htmlFor="roomName">Channel Name</label>
                <input
                  type="text"
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g., general, random, tech"
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;