import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>ChatBot AI</h2>
        </div>
        
        {user && (
          <div className="navbar-user">
            <span className="user-name">Hola, {user.name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};