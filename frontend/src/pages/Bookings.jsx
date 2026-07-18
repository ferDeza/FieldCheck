import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService, sportFieldService, scheduleService } from '../services/api';
import ScheduleWeeklyView from '../components/ScheduleWeeklyView';
import { buildContinuousBookingSelection } from '../utils/bookingSelection';
import './Bookings.css';

const Bookings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [sportFields, setSportFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFieldSchedules, setSelectedFieldSchedules] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]); // Track multiple selected times
  const [selectionError, setSelectionError] = useState('');
  const [formData, setFormData] = useState({
    userId: user?.id || null,
    fieldId: '',
    bookingDate: new Date().toISOString().split('T')[0], // Today's date
    startTime: '',
    endTime: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Update userId when user loads from auth context
  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        userId: user.id,
      }));
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Pre-select field if fieldId is in query params
    const fieldIdFromParams = searchParams.get('fieldId');
    if (fieldIdFromParams) {
      // Pre-select field even if sportFields is still loading
      setFormData((prev) => ({
        ...prev,
        fieldId: fieldIdFromParams,
      }));
      // Load schedules for this field
      loadSchedulesForField(fieldIdFromParams);
      // Show form automatically
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const fieldsData = await sportFieldService.getAllSportFields();
      setSportFields(fieldsData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load sport fields');
    }

    // Try to load bookings but don't block if it failsgetMyBookings
    try {
      const bookingsData = await bookingService.getMyBookings();
      setBookings(bookingsData);
    } catch (err) {
      console.warn('Could not load bookings:', err.message);
      setBookings([]);
    }

    setLoading(false);
  };

  const loadSchedulesForField = async (fieldId) => {
    try {
      const schedules = await scheduleService.getSchedulesByField(fieldId);
      setSelectedFieldSchedules(schedules);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setSelectedFieldSchedules([]);
    }
  };

const handleFieldChange = async (e) => {
    const fieldId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fieldId: fieldId,
      startTime: '',
      endTime: '',
    }));

    setSelectedTimes([]);
    setSelectionError('');

    if (fieldId) {
      loadSchedulesForField(fieldId);
    }
  };
const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      bookingDate: e.target.value,
      startTime: '',
      endTime: '',
    }));

    setSelectedTimes([]);
    setSelectionError('');
  };

  const handleTimeSelect = (timeData) => {
    const timeKey = `${timeData.day}-${timeData.hour}`;
    const selectedDayCode = selectedTimes.length > 0 ? selectedTimes[0].split('-')[0] : null;

    const selection = buildContinuousBookingSelection({
      selectedTimes,
      clickedTimeKey: timeKey,
      selectedDayCode,
    });

    setSelectionError(selection.error || '');
    setSelectedTimes(selection.nextSelectedTimes);

    if (selection.nextSelectedTimes.length > 0) {
      const targetDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const baseDate = new Date(formData.bookingDate + 'T00:00:00');
      const currentDayIdx = baseDate.getDay();
      const targetDayIdx = targetDays.indexOf(timeData.day);

      if (targetDayIdx !== -1) {
        const diff = targetDayIdx - currentDayIdx;
        baseDate.setDate(baseDate.getDate() + diff);
        const updatedDate = baseDate.toISOString().split('T')[0];

        setFormData((prev) => ({
          ...prev,
          bookingDate: updatedDate,
          startTime: selection.startTime,
          endTime: selection.endTime,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
      }));
    }
  };
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fieldId || !formData.startTime || !formData.endTime) {
      setError('Por favor completa todos los campos');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        userId: formData.userId,
        fieldId: parseInt(formData.fieldId),
        startTime: `${formData.bookingDate}T${String(formData.startTime).padStart(2, '0')}:00:00`,
        endTime: `${formData.bookingDate}T${String(formData.endTime).padStart(2, '0')}:00:00`,
      };

      const response = await bookingService.createBooking(bookingData);
      
      // Preparar datos para la pantalla de pago
      const bookingForPayment = {
        id: response.id,
        fieldName: getFieldName(formData.fieldId),
        startTime: formData.startTime,
        endTime: formData.endTime,
        bookingDate: formData.bookingDate,
        totalPrice: getFieldPrice(formData.fieldId) * (formData.endTime - formData.startTime),
      };

      // Resetear formulario
      setFormData({
        userId: user?.id || null,
        fieldId: '',
        bookingDate: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
      });
      setSelectedTimes([]);
      setSelectionError('');
      setSelectedFieldSchedules([]);
      setShowForm(false);

      // Redirigir a pantalla de pago
      navigate('/payment', { state: { booking: bookingForPayment } });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await bookingService.deleteBooking(id);
        await fetchData();
      } catch (err) {
        setError(err.message || 'Failed to delete booking');
      }
    }
  };

  const getFieldName = (fieldId) => {
    const numericFieldId = parseInt(fieldId);
    const field = sportFields.find((f) => f.id === numericFieldId);
    return field?.name || 'Unknown Field';
  };

  const getFieldPrice = (fieldId) => {
    const numericFieldId = parseInt(fieldId);
    const field = sportFields.find((f) => f.id === numericFieldId);
    return field?.basePrice || 0;
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>Mis Reservas</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Reserva'}
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showForm && (
        <div className="booking-form-card">
          <h2>Crea una nueva reserva</h2>
          <form onSubmit={handleCreateBooking}>
            <div className="form-group">
              <label htmlFor="fieldId">Selecciona una Cancha</label>
              <select
                id="fieldId"
                name="fieldId"
                value={formData.fieldId}
                onChange={handleFieldChange}
                required
                className="form-control"
              >
                <option value="">-- Selecciona una cancha deportiva --</option>
                {sportFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} (S/. {field.basePrice}/hora)
                  </option>
                ))}
              </select>
            </div>

            {formData.fieldId && (
              <>
                <div className="form-group">
                  <label htmlFor="bookingDate">Fecha de Reserva</label>
                  <input
                    id="bookingDate"
                    type="date"
                    value={formData.bookingDate}
                    onChange={handleDateChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="schedule-section">
                  <h3>Selecciona tu horario</h3>
                  {selectionError && (
                    <div className="error-alert">{selectionError}</div>
                  )}
                  <ScheduleWeeklyView
                    fieldId={formData.fieldId}
                    schedules={selectedFieldSchedules}
                    onTimeSelect={handleTimeSelect}
                    selectedTimes={selectedTimes}
                  />
                </div>

                <div className="booking-summary">
                  <h3>Resumen de la Reserva</h3>
                  <div className="summary-item">
                    <span>Cancha:</span>
                    <strong>{getFieldName(formData.fieldId)}</strong>
                  </div>
                  {formData.startTime && (
                    <div className="summary-item">
                      <span>Horario:</span>
                      <strong>
                        {String(formData.startTime).padStart(2, '0')}:00 -{' '}
                        {String(formData.endTime).padStart(2, '0')}:00
                      </strong>
                    </div>
                  )}
                  {formData.startTime && (
                    <div className="summary-item price-row">
                      <span>Costo Total:</span>
                      <strong>
                        S/. {(getFieldPrice(formData.fieldId) * (formData.endTime - formData.startTime)).toFixed(2)}
                      </strong>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !formData.startTime}
                >
                  {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Cargando reservas...</div>
      ) : (
        <>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tienes reservas aún</h3>
              <p>Crea tu primera reserva para empezar</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Crear Mi Primera Reserva
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              <div className="list-header">
                <h2>Tus Reservas</h2>
                <span className="count-badge">{bookings.length}</span>
              </div>

              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-title">
                      <h3>{booking.fieldName}</h3>
                      <span className="booking-id">#{booking.id}</span>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Eliminar reserva"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="booking-details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <span className="detail-label">Fecha</span>
                        <span className="detail-value">
                          {new Date(booking.startDateTime).toLocaleDateString('es-PE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <div className="detail-content">
                        <span className="detail-label">Horario</span>
                        <span className="detail-value">
                          {new Date(booking.startDateTime).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(booking.endDateTime).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div className="detail-content">
                        <span className="detail-label">Precio</span>
                        <span className="detail-value">S/. {booking.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">✓</span>
                      <div className="detail-content">
                        <span className="detail-label">Estado</span>
                        <span className="detail-value status-confirmed">Confirmado</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button className="btn-action secondary">Editar</button>
                    <button className="btn-action danger" onClick={() => handleDeleteBooking(booking.id)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookings;
