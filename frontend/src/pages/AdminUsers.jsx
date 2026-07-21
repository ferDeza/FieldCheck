import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [authLoading, user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await adminService.getUsers();
      // Filtrar para mostrar únicamente clientes (excluir ADMINs)
      const customersOnly = data.filter((u) => u.role !== 'ADMIN');
      setUsers(customersOnly);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="admin-loading">Cargando usuarios...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Usuarios Registrados</h1>
        <p>Lista de clientes que usan las canchas y sus datos básicos.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Usuarios</h2>
          <span className="admin-section-count">{users.length} usuarios</span>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.fullName}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.phoneNumber ?? 'No registrado'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state">
                    No hay usuarios registrados.
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

export default AdminUsers;
