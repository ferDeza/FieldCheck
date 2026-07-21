import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, sportFieldService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/KPICard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueError, setRevenueError] = useState(false);
  const [showCreateField, setShowCreateField] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    name: '',
    type: 'Fútbol 5',
    basePrice: '',
    district: 'Cayma',
    description: '',
  });
  const [fieldSubmitting, setFieldSubmitting] = useState(false);

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
        setRevenueError(false);
        const [dashResult, bookingsResult, fieldsResult, revenueResult] = await Promise.allSettled([
          adminService.getDashboard(),
          adminService.getBookingsForToday(),
          sportFieldService.getAllSportFields(),
          adminService.getRevenueHistory(),
        ]);

        if (dashResult.status === 'fulfilled') {
          setDashboard(dashResult.value);
        } else {
          console.error('Error fetching dashboard stats:', dashResult.reason);
          setError('Error al cargar las estadísticas principales del panel');
        }

        if (bookingsResult.status === 'fulfilled') {
          setBookingsToday(bookingsResult.value);
        } else {
          console.error('Error fetching today bookings:', bookingsResult.reason);
        }

        if (fieldsResult.status === 'fulfilled') {
          setFields(fieldsResult.value);
        } else {
          console.error('Error fetching fields:', fieldsResult.reason);
        }

        if (revenueResult.status === 'fulfilled') {
          setRevenueHistory(revenueResult.value);
        } else {
          console.error('Error fetching revenue history:', revenueResult.reason);
          setRevenueError(true);
        }
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
  const totalRevenue    = (dashboard?.totalRevenue ?? 0).toFixed(2);
  const totalFields     = fields.length;

  // Formatea "2025-06-22T08:00:00" → "08:00 – 09:00"
  const handleCreateField = async (e) => {
    e.preventDefault();
    setError('');

    if (!fieldForm.name || !fieldForm.basePrice) {
      setError('Completa el nombre y el precio base para crear la cancha.');
      return;
    }

    setFieldSubmitting(true);
    try {
      const payload = {
        ...fieldForm,
        basePrice: Number(fieldForm.basePrice),
      };

      const createdField = await adminService.createSportField(payload);
      setFields((prev) => [createdField, ...prev]);
      setFieldForm({ name: '', type: 'Fútbol 5', basePrice: '', district: 'Cayma', description: '' });
      setShowCreateField(false);
    } catch (err) {
      setError(err.message || 'No se pudo crear la cancha');
    } finally {
      setFieldSubmitting(false);
    }
  };

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
          value={`S/. ${totalRevenue}`}
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
          value={totalFields}
          subtitle="Todas operativas"
          icon="⚽"
        />
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Ingresos de los últimos 7 días</h2>
        </div>
        <div className="revenue-history-list">
          {revenueHistory.length > 0 ? revenueHistory.map((item) => (
            <div key={item.label} className="revenue-history-item">
              <span>{new Date(item.label).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</span>
              <strong>S/. {Number(item.revenue || 0).toFixed(2)}</strong>
            </div>
          )) : <p className="empty-state">Sin historial disponible</p>}
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Gestión de canchas</h2>
          <button className="admin-section-link" onClick={() => setShowCreateField((prev) => !prev)}>
            {showCreateField ? 'Cerrar' : '+ Agregar cancha'}
          </button>
        </div>

        {showCreateField && (
          <form className="admin-form" onSubmit={handleCreateField}>
            <div className="admin-form-grid">
              <label>
                Nombre
                <input value={fieldForm.name} onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })} required />
              </label>
              <label>
                Tipo
                <select value={fieldForm.type} onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value })}>
                  <option value="Fútbol 5">Fútbol 5</option>
                  <option value="Fútbol 7">Fútbol 7</option>
                  <option value="Fútbol 11">Fútbol 11</option>
                  <option value="Vóley">Vóley</option>
                </select>
              </label>
              <label>
                Precio base / hora
                <input type="number" min="0" step="0.01" value={fieldForm.basePrice} onChange={(e) => setFieldForm({ ...fieldForm, basePrice: e.target.value })} required />
              </label>
              <label>
                Distrito
                <input value={fieldForm.district} onChange={(e) => setFieldForm({ ...fieldForm, district: e.target.value })} required />
              </label>
            </div>
            <label>
              Descripción
              <textarea value={fieldForm.description} onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })} rows="3" />
            </label>
            <button type="submit" className="admin-submit-btn" disabled={fieldSubmitting}>
              {fieldSubmitting ? 'Guardando...' : 'Crear cancha'}
            </button>
          </form>
        )}
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