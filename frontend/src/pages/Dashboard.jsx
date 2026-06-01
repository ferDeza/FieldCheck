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
        <h1>Bienvenido, {user?.fullName || 'User'}!</h1>
        <p>Aquí está lo que está sucediendo con tus reservas deportivas</p>
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
                <p>Canchas Disponibles</p>
              </div>
            </Link>

            <Link to="/bookings" className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{bookingCount}</h3>
                <p>Tus Reservas</p>
              </div>
            </Link>
          </div>

          <div className="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div className="action-buttons">
              <Link to="/sport-fields" className="action-btn primary">
                Explorar Canchas
              </Link>
              <Link to="/bookings" className="action-btn secondary">
                Ver Mis Reservas
              </Link>
            </div>
          </div>

          <div className="dashboard-info">
            <h2>Empecemos</h2>
            <div className="info-cards">
              <div className="info-card">
                <h3>📍 Encontrar Canchas</h3>
                <p>Explora las canchas deportivas disponibles en tu área y verifica su disponibilidad.</p>
              </div>
              <div className="info-card">
                <h3>🎫 Hacer Reservas</h3>
                <p>Reserva tu espacio preferido y asegura tu lugar.</p>
              </div>
              <div className="info-card">
                <h3>📋 Controla tus reservas</h3>
                <p>Visualiza, modifica o cancela tus reservas en cualquier momento.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
