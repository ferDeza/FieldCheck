import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, sportFieldService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);
  const [fieldCount, setFieldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, fields] = await Promise.all([
          bookingService.getAllBookings(),
          sportFieldService.getAllSportFields(),
        ]);
        setBookingCount(bookings.length);
        setFieldCount(fields.length);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.email || 'User'}! 👋</h1>
        <p>Here's what's happening with your sports bookings</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <Link to="/sport-fields" className="stat-card">
              <div className="stat-icon">⚽</div>
              <div className="stat-content">
                <h3>{fieldCount}</h3>
                <p>Sport Fields Available</p>
              </div>
            </Link>

            <Link to="/bookings" className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{bookingCount}</h3>
                <p>Your Bookings</p>
              </div>
            </Link>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/sport-fields" className="action-btn primary">
                Browse Sport Fields
              </Link>
              <Link to="/bookings" className="action-btn secondary">
                View My Bookings
              </Link>
            </div>
          </div>

          <div className="dashboard-info">
            <h2>Getting Started</h2>
            <div className="info-cards">
              <div className="info-card">
                <h3>📍 Find Fields</h3>
                <p>Browse available sport fields in your area and check their availability.</p>
              </div>
              <div className="info-card">
                <h3>🎫 Make Bookings</h3>
                <p>Reserve your preferred time slots and secure your spot.</p>
              </div>
              <div className="info-card">
                <h3>📋 Manage Bookings</h3>
                <p>View, modify, or cancel your bookings anytime.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
