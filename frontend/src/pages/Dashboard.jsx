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
        setLoading(true);
        
        // Si el usuario es ADMIN, evitamos pedir "Mis Reservas" de cliente 
        // y solo traemos la información global necesaria para su rol.
        if (user?.role === 'ADMIN') {
          const fields = await sportFieldService.getAllSportFields();
          setFieldCount(fields.length);
        } else {
          // Flujo normal para Clientes regulares
          const [bookings, fields] = await Promise.all([
            bookingService.getMyBookings(),
            sportFieldService.getAllSportFields(),
          ]);
          setBookingCount(bookings.length);
          setFieldCount(fields.length);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading-spinner">Cargando panel...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* HEADER CONDICIONAL */}
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.fullName || 'Usuario'}!</h1>
        <p>
          {user?.role === 'ADMIN'
            ? 'Panel de control general del complejo deportivo.'
            : 'Aquí está lo que está sucediendo con tus reservas deportivas'}
        </p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {/* ========================================================= */}
      {/* 1. VISTA EXCLUSIVA PARA EL ADMINISTRADOR                  */}
      {/* ========================================================= */}
      {user?.role === 'ADMIN' ? (
        <>
          <div className="dashboard-grid">
            <Link to="/sport-fields" className="stat-card">
              <div className="stat-icon">🏟️</div>
              <div className="stat-content">
                <h3>{fieldCount}</h3>
                <p>Canchas Totales</p>
              </div>
            </Link>

            <Link to="/admin-dashboard" className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Ver Caja</h3>
                <p>Ingresos y Métricas</p>
              </div>
            </Link>
          </div>

          <div className="quick-actions">
            <h2>Acciones de Gestión</h2>
            <div className="action-buttons">
              <Link to="/admin-dashboard" className="action-btn primary">
                Ver Panel de Reservas
              </Link>
              <Link to="/sport-fields" className="action-btn secondary">
                Administrar Canchas
              </Link>
            </div>
          </div>

          <div className="dashboard-info">
            <h2>Gestión de CanchaYa</h2>
            <div className="info-cards">
              <div className="info-card">
                <h3>⚙️ Configurar Disponibilidad</h3>
                <p>Modifica el estado de las canchas, deshabilítalas por mantenimiento o actualiza sus precios por hora.</p>
              </div>
              <div className="info-card">
                <h3>📈 Control de Ingresos</h3>
                <p>Monitorea los pagos pendientes, las señas confirmadas y el balance de las reservas del día de hoy.</p>
              </div>
              <div className="info-card">
                <h3>📋 Historial de Auditoría</h3>
                <p>Supervisa en tiempo real qué clientes están reservando, sus teléfonos de contacto y cancelaciones.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ========================================================= */
        /* 2. VISTA PARA EL CLIENTE (MANTIENE TU LÓGICA ORIGINAL)    */
        /* ========================================================= */
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