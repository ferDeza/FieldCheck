import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    billingEmail: user?.email || '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Obtener detalles de la reserva del state de navegación
    if (location.state?.booking) {
      setBookingDetails(location.state.booking);
    } else {
      // Si no hay booking, redirigir a bookings
      navigate('/bookings');
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear el número de tarjeta
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      return;
    }

    // Formatear expiración (MM/YY)
    if (name === 'cardExpiry') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setPaymentData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      return;
    }

    // CVV solo números
    if (name === 'cardCVV') {
      setPaymentData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, '').slice(0, 3),
      }));
      return;
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    // Validar tarjeta
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Número de tarjeta inválido');
      setProcessing(false);
      return;
    }

    if (!paymentData.cardName) {
      setError('Nombre del titular es requerido');
      setProcessing(false);
      return;
    }

    if (!paymentData.cardExpiry || paymentData.cardExpiry.length !== 5) {
      setError('Fecha de expiración inválida (MM/YY)');
      setProcessing(false);
      return;
    }

    if (!paymentData.cardCVV || paymentData.cardCVV.length !== 3) {
      setError('CVV inválido');
      setProcessing(false);
      return;
    }

    try {
      // Crear pago en backend (PENDING)
      const payerId = user?.id || bookingDetails.payerId || null;
      const created = await (await import('../services/api')).paymentService.createPayment(
        bookingDetails.id,
        payerId,
        bookingDetails.totalPrice,
        'CARD'
      );

      // Confirmar el pago inmediatamente para pruebas
      await (await import('../services/api')).paymentService.confirmPayment(created.id);

      setSuccess(true);
      setProcessing(false);
      setTimeout(() => {
        navigate('/bookings', { 
          state: { paymentSuccess: true, bookingId: bookingDetails?.id } 
        });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (!bookingDetails) {
    return <div className="loading">Cargando...</div>;
  }

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h2>¡Pago Realizado!</h2>
        <p>Tu reserva ha sido confirmada</p>
        <p className="booking-id">ID de reserva: #{bookingDetails.id}</p>
        <p className="redirect-text">Redirigiendo a tus reservas...</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-left">
          <h1>Completar Pago</h1>
          
          <div className="booking-summary-payment">
            <h3>Resumen de Reserva</h3>
            <div className="summary-item">
              <span>Cancha:</span>
              <strong>{bookingDetails.fieldName}</strong>
            </div>
            <div className="summary-item">
              <span>Horario:</span>
              <strong>
                {String(bookingDetails.startTime).padStart(2, '0')}:00 - {String(bookingDetails.endTime).padStart(2, '0')}:00
              </strong>
            </div>
            <div className="summary-item">
              <span>Fecha:</span>
              <strong>{new Date(bookingDetails.bookingDate).toLocaleDateString('es-PE')}</strong>
            </div>
            <div className="summary-item">
              <span>Duración:</span>
              <strong>{bookingDetails.endTime - bookingDetails.startTime} hora(s)</strong>
            </div>
            <div className="summary-item total">
              <span>Total a Pagar:</span>
              <strong>S/. {bookingDetails.totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="payment-right">
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Datos de Pago</h2>

            {error && <div className="error-alert">{error}</div>}

            <div className="form-group">
              <label htmlFor="billingEmail">Email de Facturación</label>
              <input
                type="email"
                id="billingEmail"
                name="billingEmail"
                value={paymentData.billingEmail}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Número de Tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardName">Nombre del Titular</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={paymentData.cardName}
                onChange={handleInputChange}
                placeholder="JUAN PÉREZ"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiración (MM/YY)</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={paymentData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="12/25"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardCVV">CVV</label>
                <input
                  type="text"
                  id="cardCVV"
                  name="cardCVV"
                  value={paymentData.cardCVV}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-payment"
              disabled={processing}
            >
              {processing ? 'Procesando...' : `Pagar S/. ${bookingDetails.totalPrice.toFixed(2)}`}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/bookings')}
              disabled={processing}
            >
              Cancelar
            </button>

            <div className="payment-security">
              <div className="security-badge">
                <span className="lock-icon">🔒</span>
                <span>Pago Seguro</span>
              </div>
              <p>Tu información es procesada de forma segura</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
