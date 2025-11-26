import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';
import { MessageCircle, LogOut } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user || !token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <SocketProvider token={token}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <MessageCircle size={28} />
              Chat App
            </h1>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>
        <div className="main-container">
          <Chat user={user} />
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;