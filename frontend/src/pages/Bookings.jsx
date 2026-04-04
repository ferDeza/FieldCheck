import React, { useEffect, useState } from 'react';
import { bookingService, sportFieldService } from '../services/api';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sportFields, setSportFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sportFieldId: '',
    startDateTime: '',
    endDateTime: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsData, fieldsData] = await Promise.all([
        bookingService.getAllBookings(),
        sportFieldService.getAllSportFields(),
      ]);
      setBookings(bookingsData);
      setSportFields(fieldsData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await bookingService.createBooking(formData);
      setFormData({
        sportFieldId: '',
        startDateTime: '',
        endDateTime: '',
        notes: '',
      });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        await fetchData();
      } catch (err) {
        setError(err.message || 'Failed to delete booking');
      }
    }
  };

  const getFieldName = (fieldId) => {
    const field = sportFields.find((f) => f.id === fieldId);
    return field?.name || 'Unknown Field';
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Booking'}
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showForm && (
        <div className="booking-form-card">
          <h2>Create New Booking</h2>
          <form onSubmit={handleCreateBooking}>
            <div className="form-group">
              <label htmlFor="sportFieldId">Sport Field</label>
              <select
                id="sportFieldId"
                name="sportFieldId"
                value={formData.sportFieldId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a sport field</option>
                {sportFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDateTime">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDateTime">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Booking'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading bookings...</div>
      ) : (
        <>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No bookings yet</h3>
              <p>Create your first booking to get started</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create Booking
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{getFieldName(booking.sportFieldId)}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Delete booking"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail">
                      <span className="label">📅 Date</span>
                      <span className="value">
                        {new Date(booking.startDateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">⏰ Time</span>
                      <span className="value">
                        {new Date(booking.startDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(booking.endDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {booking.notes && (
                      <div className="detail">
                        <span className="label">📝 Notes</span>
                        <span className="value">{booking.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-status">
                    <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                      {booking.status || 'Active'}
                    </span>
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
