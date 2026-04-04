import React, { useEffect, useState } from 'react';
import { sportFieldService } from '../services/api';
import './SportFields.css';

const SportFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSportFields();
  }, []);

  const fetchSportFields = async () => {
    try {
      const data = await sportFieldService.getAllSportFields();
      setFields(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load sport fields');
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sport-fields-container">
      <div className="sport-fields-header">
        <h1>Sport Fields</h1>
        <p>Find and book your favourite sports fields</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Loading sport fields...</div>
      ) : (
        <>
          {filteredFields.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏟️</div>
              <h3>
                {searchTerm ? 'No fields found' : 'No sport fields available'}
              </h3>
              <p>
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Please check back later'}
              </p>
            </div>
          ) : (
            <div className="fields-grid">
              {filteredFields.map((field) => (
                <div key={field.id} className="field-card">
                  <div className="field-image">
                    <div className="image-placeholder">⚽</div>
                  </div>

                  <div className="field-content">
                    <h3>{field.name}</h3>

                    <div className="field-info">
                      {field.location && (
                        <div className="info-item">
                          <span className="info-icon">📍</span>
                          <span className="info-text">{field.location}</span>
                        </div>
                      )}

                      {field.description && (
                        <div className="info-item">
                          <span className="info-icon">📝</span>
                          <span className="info-text">{field.description}</span>
                        </div>
                      )}

                      {field.surfaceType && (
                        <div className="info-item">
                          <span className="info-icon">🌱</span>
                          <span className="info-text">{field.surfaceType}</span>
                        </div>
                      )}

                      {field.capacity && (
                        <div className="info-item">
                          <span className="info-icon">👥</span>
                          <span className="info-text">
                            Capacity: {field.capacity}
                          </span>
                        </div>
                      )}

                      {field.pricePerHour && (
                        <div className="info-item price">
                          <span className="info-icon">💰</span>
                          <span className="info-text">
                            ${field.pricePerHour}/hour
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="field-contact">
                      {field.phone && (
                        <div className="contact-item">
                          <span>☎️</span>
                          <a href={`tel:${field.phone}`}>{field.phone}</a>
                        </div>
                      )}

                      {field.email && (
                        <div className="contact-item">
                          <span>✉️</span>
                          <a href={`mailto:${field.email}`}>{field.email}</a>
                        </div>
                      )}
                    </div>

                    <button className="book-btn">Book Now</button>
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

export default SportFields;
