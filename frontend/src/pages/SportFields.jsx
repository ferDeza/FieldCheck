import React, { useEffect, useState, useCallback } from 'react'; // Añadido useCallback
import { useNavigate } from 'react-router-dom';
import { sportFieldService } from '../services/api';
import './SportFields.css';

const SportFields = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const districts = ['Cayma', 'Yanahuara', 'Cercado', 'La Joya', 'Sachaca', 'Socabaya'];
  const sportTypes = ['Fútbol 5', 'Fútbol 7', 'Fútbol 11', 'Vóley'];

  // Envolvemos la función con useCallback para estabilizar su referencia
  const fetchSportFields = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sportFieldService.getAllSportFields(
        selectedDistrict || undefined,
        selectedType || undefined
      );
      setFields(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load sport fields');
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, selectedType]); // Reacciona de forma segura si cambian estos filtros

  // Ahora fetchSportFields es una dependencia válida y segura
  useEffect(() => {
    fetchSportFields();
  }, [fetchSportFields]);

  const filteredFields = fields.filter(
    (field) =>
      field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReserveClick = (fieldId) => {
    navigate(`/bookings?fieldId=${fieldId}`);
  };

  return (
    <div className="sport-fields-container">
      <div className="sport-fields-header">
        <h1>Catálogo de Canchas</h1>
        <p>Encuentra y reserva tu cancha deportiva favorita en Arequipa</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar canchas..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Distrito</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los distritos</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tipo de Deporte</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los deportes</option>
              {sportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fecha</label>
            <input type="date" className="filter-input" />
          </div>

          <div className="filter-group">
            <label>Hora</label>
            <input type="time" className="filter-input" />
          </div>
        </div>

        <button className="search-btn" onClick={fetchSportFields}>
          Buscar Canchas
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Cargando canchas deportivas...</div>
      ) : (
        <>
          {filteredFields.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏟️</div>
              <h3>
                {searchTerm || selectedDistrict || selectedType
                  ? 'No se encontraron canchas'
                  : 'No hay canchas disponibles'}
              </h3>
              <p>
                {searchTerm || selectedDistrict || selectedType
                  ? 'Intenta ajustar tus criterios de búsqueda'
                  : 'Por favor, vuelve más tarde'}
              </p>
            </div>
          ) : (
            <div className="fields-grid">
              {filteredFields.map((field) => (
                <div key={field.id} className="field-card">
                  <div className="field-image">
                    {field.photoUrl ? (
                      <img src={field.photoUrl} alt={field.name} />
                    ) : (
                      <div className="image-placeholder">⚽</div>
                    )}
                    {field.rating && (
                      <div className="field-rating">
                        ⭐ {field.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="field-content">
                    <h3>{field.name}</h3>

                    <div className="field-tags">
                      {field.type && (
                        <span className="tag sport-tag">{field.type}</span>
                      )}
                      {field.district && (
                        <span className="tag district-tag">{field.district}</span>
                      )}
                    </div>

                    <div className="field-info">
                      {field.district && (
                        <div className="info-item">
                          <span className="info-icon">📍</span>
                          <span className="info-text">{field.district}</span>
                        </div>
                      )}

                      {field.description && (
                        <div className="info-item">
                          <span className="info-icon">📝</span>
                          <span className="info-text">{field.description}</span>
                        </div>
                      )}

                      {field.basePrice && (
                        <div className="info-item price">
                          <span className="info-icon">💰</span>
                          <span className="info-text">
                            S/. {field.basePrice}/hora
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      className="book-btn"
                      onClick={() => handleReserveClick(field.id)}
                    >
                      Reservar Ahora
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

export default SportFields;