import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">⚽</span>
          FieldCheck
        </Link>

        {isAuthenticated ? (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sport-fields" className="nav-link">
                Sport Fields
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/bookings" className="nav-link">
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link register-link">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
