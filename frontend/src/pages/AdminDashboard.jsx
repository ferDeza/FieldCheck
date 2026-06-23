import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/KPICard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fix: si authLoading es true, espera — no ejecutes nada todavía
    if (authLoading) return;

    if (!user || user.role !== 'ADMIN') {
      console.warn('Acceso no autorizado detectado.');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [dashData, todayBookings] = await Promise.all([
          adminService.getDashboard(),
          adminService.getBookingsForToday(),
        ]);
        setDashboard(dashData);
        setBookingsToday(todayBookings);
      } catch (err) {
        setError(err.message || 'Error al cargar el panel de administración');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <div className="admin-loading">Cargando panel de administración...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <div className="admin-error">Acceso denegado. Redirigiendo...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  // Calculados desde bookingsToday (BookingWebDTO real)
  const paidBookings    = bookingsToday.filter(b => b.paid);
  const pendingBookings = bookingsToday.filter(b => !b.paid);
  const paidTotal       = paidBookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0).toFixed(2);
  const pendingTotal    = pendingBookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0).toFixed(2);

  // Formatea "2025-06-22T08:00:00" → "08:00 – 09:00"
  const formatRange = (start, end) => {
    const fmt = (dt) =>
      new Date(dt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  // Formatea fecha corta para recentBookings: "22 jun, 08:00"
  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.fullName || 'Administrador'}</p>
      </div>

      {/* KPIs — todos con campos reales del AdminDashboardDTO */}
      <div className="kpi-grid">
        <KPICard
          title="Total Reservas"
          value={dashboard?.totalReservations ?? 0}
          subtitle="Todas las reservas"
          icon="📋"
        />
        <KPICard
          title="Ingresos Totales"
          value={`S/. ${(dashboard?.totalRevenue ?? 0).toFixed(2)}`}
          subtitle="Acumulado"
          icon="💰"
        />
        <KPICard
          title="Clientes Activos"
          value={dashboard?.activeCustomers ?? 0}
          subtitle="Usuarios registrados"
          icon="👥"
        />
        <KPICard
          title="Canchas Activas"
          value={dashboard?.activeSportFields ?? 0}
          subtitle="Todas operativas"
          icon="⚽"
        />
      </div>

      {/* Resumen del día — calculado desde getBookingsForToday */}
      <div className="admin-today-summary">
        <div className="today-stat">
          <span className="today-stat-value">{bookingsToday.length}</span>
          <span className="today-stat-label">Reservas hoy</span>
        </div>
        <div className="today-stat green">
          <span className="today-stat-value">S/. {paidTotal}</span>
          <span className="today-stat-label">{paidBookings.length} pagos confirmados</span>
        </div>
        <div className="today-stat amber">
          <span className="today-stat-value">S/. {pendingTotal}</span>
          <span className="today-stat-label">{pendingBookings.length} pagos pendientes</span>
        </div>
      </div>

      {/* Tabla de reservas de hoy — campos reales de BookingWebDTO */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Reservas de Hoy</h2>
          <span className="admin-section-count">{bookingsToday.length} reservas</span>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Horario</th>
                <th>Cancha</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookingsToday.length > 0 ? (
                bookingsToday.map((booking) => (
                  <tr key={booking.id}>
                    {/* startDateTime + endDateTime reales */}
                    <td className="time-cell">
                      {formatRange(booking.startDateTime, booking.endDateTime)}
                    </td>
                    {/* fieldName real */}
                    <td>{booking.fieldName}</td>
                    {/* customerName real (fullName del User) */}
                    <td>{booking.customerName}</td>
                    {/* totalPrice real — con fallback por si viene null */}
                    <td className="price-cell">
                      S/. {(booking.price ?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`payment-badge ${booking.paid ? 'paid' : 'pending'}`}>
                        {booking.paid ? '✓ Pagado' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn-small"
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No hay reservas registradas para hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservas recientes — viene de dashboard.recentBookings (últimas 5) */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Últimas 5 Reservas</h2>
          <button
            className="admin-section-link"
            onClick={() => navigate('/admin/bookings')}
          >
            Ver todas →
          </button>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Cancha</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentBookings?.length > 0 ? (
                dashboard.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="time-cell">
                      {formatDateTime(booking.startDateTime)}
                    </td>
                    <td>{booking.fieldName}</td>
                    <td>{booking.customerName}</td>
                    <td className="price-cell">
                      S/. {(booking.price?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`payment-badge ${booking.paid ? 'paid' : 'pending'}`}>
                        {booking.paid ? '✓ Pagado' : '⏳ Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Sin reservas recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;