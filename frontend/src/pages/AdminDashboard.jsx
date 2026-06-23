
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para redirigir intrusos
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/KPICard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth(); // Asumiendo que useAuth maneja un estado de carga inicial
  const navigate = useNavigate();
  
  const [dashboard, setDashboard] = useState(null);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. CONTROL DE ACCESO EXCLUSIVO PARA ADMIN
    // Si la autenticación ya cargó y el usuario no existe o no tiene el rol de ADMIN, se le banea.
    // NOTA: Ajusta 'ADMIN' por el string exacto que devuelva tu JWT (ej. 'ROLE_ADMIN' o 'ADMIN')
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        console.warn('Acceso no autorizado detectado.');
        navigate('/'); // Redirige al Home inmediatamente
        return;
      }
    }

    // 2. CARGA DE DATOS REALES (Solo si es Administrador confirmado)
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

    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  // Pantalla de espera mientras se valida el rol o se descargan los datos de la BD
  if (authLoading || loading) {
    return <div className="admin-loading">Cargando panel de administración...</div>;
  }

  // Doble capa de seguridad para evitar parpadeos visuales de datos protegidos
  if (!user || user.role !== 'ADMIN') {
    return <div className="admin-error">Acceso denegado. Redirigiendo...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.name || 'Administrador'}</p>
      </div>

      {/* KPI Cards Dinámicas */}
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

      {/* Tabla de Próximas Reservas Reales */}
      <div className="admin-section">
        <h2>Próximas Reservas de Hoy</h2>
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
                    <td>{booking.customerPhone || 'Sin teléfono'}</td>
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
                      <button className="action-btn-small" onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No hay reservas registradas para el día de hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas Reales extraídas de la Base de Datos */}
      <div className="admin-grid">
        {/* Gráfico Semanal Dinámico */}
        <div className="admin-card">
          <h3>Ingresos Semanales</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {dashboard?.weeklyIncome?.map((item) => (
                <div key={item.day} className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: `${item.percentage}%`,
                    }}
                    title={`S/. ${item.amount.toFixed(2)}`}
                  ></div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ranking de Canchas Dinámico */}
        <div className="admin-card">
          <h3>Canchas Más Reservadas</h3>
          <div className="ranking-list">
            {dashboard?.mostReservedFields?.map((field) => (
              <div key={field.rank} className="ranking-item">
                <span className="rank">{field.rank}.</span>
                <span className="name">{field.name}</span>
                <span className="count">{field.count} reservas</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historial de Auditoría / Actividad Reciente */}
      <div className="admin-section">
        <h3>Actividad Reciente</h3>
        <div className="activity-list">
          {dashboard?.recentActivities?.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-text" dangerouslySetInnerHTML={{ __html: activity.text }}></p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
