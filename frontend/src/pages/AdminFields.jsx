import React, { useEffect, useState } from 'react';
import { adminService, sportFieldService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminFields = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(location.pathname.endsWith('/new'));
  const [fieldForm, setFieldForm] = useState({
    name: '',
    type: 'Fútbol 5',
    basePrice: '',
    district: 'Cayma',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchFields();
  }, [authLoading, user, navigate]);

  useEffect(() => {
    setShowForm(location.pathname.endsWith('/new'));
  }, [location.pathname]);

  const fetchFields = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await sportFieldService.getAllSportFields();
      setFields(data);
    } catch (err) {
      setError(err.message || 'Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async (event) => {
    event.preventDefault();
    setError('');

    if (!fieldForm.name || !fieldForm.basePrice) {
      setError('Completa el nombre y el precio base para crear la cancha.');
      return;
    }

    setSubmitting(true);
    try {
      const fieldData = {
        ...fieldForm,
        basePrice: Number(fieldForm.basePrice),
      };
      const created = await adminService.createSportField(fieldData);
      setFields((prev) => [created, ...prev]);
      setFieldForm({ name: '', type: 'Fútbol 5', basePrice: '', district: 'Cayma', description: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'No se pudo crear la cancha');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="admin-loading">Cargando canchas...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Administrar Canchas</h1>
        <p>Registra nuevas canchas y revisa las canchas existentes.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="admin-section admin-page-actions">
        <button className="action-btn primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Cerrar formulario' : 'Agregar nueva cancha'}
        </button>
      </div>

      {showForm && (
        <div className="admin-section">
          <form className="admin-form" onSubmit={handleCreateField}>
            <div className="admin-form-grid">
              <label>
                Nombre
                <input
                  value={fieldForm.name}
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Tipo
                <select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value })}
                >
                  <option value="Fútbol 5">Fútbol 5</option>
                  <option value="Fútbol 7">Fútbol 7</option>
                  <option value="Fútbol 11">Fútbol 11</option>
                  <option value="Vóley">Vóley</option>
                </select>
              </label>
              <label>
                Precio base / hora
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={fieldForm.basePrice}
                  onChange={(e) => setFieldForm({ ...fieldForm, basePrice: e.target.value })}
                  required
                />
              </label>
              <label>
                Distrito
                <input
                  value={fieldForm.district}
                  onChange={(e) => setFieldForm({ ...fieldForm, district: e.target.value })}
                  required
                />
              </label>
            </div>
            <label>
              Descripción
              <textarea
                value={fieldForm.description}
                onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })}
                rows="3"
              />
            </label>
            <button type="submit" className="admin-submit-btn" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Crear cancha'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Canchas existentes</h2>
          <span className="admin-section-count">{fields.length} canchas</span>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Distrito</th>
                <th>Precio base</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {fields.length > 0 ? (
                fields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.name}</td>
                    <td>{field.type}</td>
                    <td>{field.district}</td>
                    <td>S/. {Number(field.basePrice).toFixed(2)}</td>
                    <td>{field.description || 'Sin descripción'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No hay canchas registradas.
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

export default AdminFields;
