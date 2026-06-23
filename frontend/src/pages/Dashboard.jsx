import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, sportFieldService } from '../services/api';
import './Dashboard.css';

// ─── Dashboard del ADMIN ───────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFields: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [bookings, fields] = await Promise.all([
          bookingService.getAllBookings(),   // endpoint de admin
          sportFieldService.getAllSportFields(),
        ]);
        setStats({
          totalBookings: bookings.length,
          totalFields: fields.length,
          pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        });
      } catch (err) {
        setError(err.message || 'Error al cargar datos de administración');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="loading-spinner">Cargando...</div>;

  return (
    <div className="dashboard-container admin-dashboard">
      <div className="dashboard-header admin-header">
        <h1>🛠️ Panel de Administración</h1>
        <p>Gestiona canchas, reservas y usuarios desde aquí</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="dashboard-grid">
        <Link to="/admin/fields" className="stat-card admin-card">
          <div className="stat-icon">🏟️</div>
          <div className="stat-content">
            <h3>{stats.totalFields}</h3>
            <p>Canchas Registradas</p>
          </div>
        </Link>

        <Link to="/admin/bookings" className="stat-card admin-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Reservas Totales</p>
          </div>
        </Link>

        <Link to="/admin/bookings?status=PENDING" className="stat-card admin-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingBookings}</h3>
            <p>Reservas Pendientes</p>
          </div>
        </Link>
      </div>

      <div className="quick-actions">
        <h2>Acciones de Administración</h2>
        <div className="action-buttons">
          <Link to="/admin/fields/new" className="action-btn primary">
            ➕ Agregar Cancha
          </Link>
          <Link to="/admin/bookings" className="action-btn secondary">
            📋 Gestionar Reservas
          </Link>
          <Link to="/admin/users" className="action-btn secondary">
            👥 Ver Usuarios
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard del USUARIO normal ──────────────────────────────────────────
const UserDashboard = () => {
  const { user } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);
  const [fieldCount, setFieldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, fields] = await Promise.all([
          bookingService.getMyBookings(),
          sportFieldService.getAllSportFields(),
        ]);
        setBookingCount(bookings.length);
        setFieldCount(fields.length);
      } catch (err) {
        setError(err.message || 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Cargando...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.fullName || 'User'}!</h1>
        <p>Aquí está lo que está sucediendo con tus reservas deportivas</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

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
            <p>Explora las canchas deportivas disponibles en tu área.</p>
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
    </div>
  );
};

// ─── Componente principal: decide qué dashboard mostrar ────────────────────
const Dashboard = () => {
  const { user } = useAuth();

  // Ajusta 'ADMIN' al valor exacto que devuelve tu backend (ej: 'ROLE_ADMIN', 'admin')
  const isAdmin = user?.role === 'ADMIN';

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;