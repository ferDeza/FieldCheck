import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import './AdminDashboard.css';

const AdminBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [authLoading, user, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="admin-loading">Cargando reservas...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Reservas Administrativas</h1>
        <p>Revisa todas las reservas realizadas en la plataforma.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Listado de Reservas</h2>
          <span className="admin-section-count">{bookings.length} reservas</span>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cancha</th>
                <th>Cliente</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Monto</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.fieldName}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.startDateTime}</td>
                    <td>{booking.endDateTime}</td>
                    <td>S/. {(booking.price ?? 0).toFixed(2)}</td>
                    <td>
                      <span className={`payment-badge ${booking.paid ? 'paid' : 'pending'}`}>
                        {booking.paid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No hay reservas disponibles.
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

export default AdminBookings;
