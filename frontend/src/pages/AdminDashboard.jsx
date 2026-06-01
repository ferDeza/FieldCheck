import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/KPICard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, todayBookings] = await Promise.all([
          adminService.getDashboard(),
          adminService.getBookingsForToday(),
        ]);
        setDashboard(dashData);
        setBookingsToday(todayBookings);
      } catch (err) {
        setError(err.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="admin-loading">Cargando panel de administración...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.name || 'Admin'}</p>
      </div>

      {/* KPI Cards */}
      {dashboard && (
        <div className="kpi-grid">
          <KPICard
            title="Reservas Hoy"
            value={bookingsToday.length}
            subtitle="Nuevas reservas"
            icon="📅"
          />
          <KPICard
            title="Pagos Confirmados"
            value={`S/. ${bookingsToday.filter(b => b.paid).reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2)}`}
            subtitle={`${bookingsToday.filter(b => b.paid).length} pagos`}
            icon="✓"
          />
          <KPICard
            title="Pagos Pendientes"
            value={`S/. ${bookingsToday.filter(b => !b.paid).reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2)}`}
            subtitle={`${bookingsToday.filter(b => !b.paid).length} pendientes`}
            icon="⏳"
          />
          <KPICard
            title="Canchas Activas"
            value={dashboard.activeSportFields}
            subtitle="Todas operativas"
            icon="⚽"
          />
        </div>
      )}

      {/* Recent Bookings */}
      <div className="admin-section">
        <h2>Próximas Reservas</h2>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cancha</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Monto</th>
                <th>Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookingsToday.length > 0 ? (
                bookingsToday.map((booking) => (
                  <tr key={booking.id}>
                    <td className="time-cell">{booking.schedule}</td>
                    <td>{booking.fieldName}</td>
                    <td>{booking.customerName}</td>
                    <td>+51 (555) 123-456</td>
                    <td className="price-cell">S/. {booking.price.toFixed(2)}</td>
                    <td>
                      <span className={`payment-badge ${booking.paid ? 'paid' : 'pending'}`}>
                        {booking.paid ? '✓ Pagado' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge confirmed">Confirmado</span>
                    </td>
                    <td>
                      <button className="action-btn-small">Ver</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No hay reservas para hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Ingresos Semanales</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                    }}
                  ></div>
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3>Canchas Más Reservadas</h3>
          <div className="ranking-list">
            <div className="ranking-item">
              <span className="rank">1.</span>
              <span className="name">Cancha 1 (Fútbol 7)</span>
              <span className="count">24 reservas</span>
            </div>
            <div className="ranking-item">
              <span className="rank">2.</span>
              <span className="name">Cancha 2 (Fútbol 5)</span>
              <span className="count">18 reservas</span>
            </div>
            <div className="ranking-item">
              <span className="rank">3.</span>
              <span className="name">Cancha 3 (Vóley)</span>
              <span className="count">12 reservas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="admin-section">
        <h3>Actividad Reciente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-text">Nueva reserva de <strong>Juan Pérez</strong></p>
              <span className="activity-time">Hace 5 minutos</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <p className="activity-text">Pago recibido de <strong>María Rodríguez</strong></p>
              <span className="activity-time">Hace 15 minutos</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🚫</div>
            <div className="activity-content">
              <p className="activity-text">Reserva cancelada por <strong>Carlos Gómez</strong></p>
              <span className="activity-time">Hace 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
