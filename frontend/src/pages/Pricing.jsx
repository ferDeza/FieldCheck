import React from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      {/* Hero / Presentación Section */}
      <section className="pricing-hero">
        <h1>Conoce CanchaYa</h1>
        <div className="pricing-about-text">
          <p>
            Somos <strong>CanchaYa</strong>, la primera plataforma 100% local en Arequipa dedicada a conectar jugadores con los mejores complejos deportivos. Buscamos que reservar tu cancha favorita sea rápido, seguro y sin fricciones: reserva y paga en menos de 2 minutos, sin llamadas ni esperas, y con la garantía de que tu espacio estará asegurado antes de salir de casa.
          </p>
          <p>
            Para los dueños de complejos, nos convertimos en su mejor aliado digital: un canal de ventas que les ayuda a llenar sus horarios libres, reducir cancelaciones de último momento y digitalizar toda su operación de manera simple.
          </p>
        </div>
      </section>

      {/* Main SaaS Subscriptions Section */}
      <h2 className="pricing-section-title">Planes para Complejos Deportivos</h2>
      <section className="pricing-grid">
        {/* Plan Básico */}
        <div className="pricing-card">
          <div className="card-header">
            <h3>Plan Básico</h3>
            <span className="card-target">Complejo deportivo (con 1 a 2 canchas)</span>
          </div>
          <div className="card-price-container">
            <span className="card-price">S/. 79</span>
            <span className="card-period">/ mes</span>
          </div>
          <ul className="card-features">
            <li>Calendario digital de reservas</li>
            <li>Cobro digital integrado</li>
            <li>Gestión de clientes y horarios</li>
          </ul>
          <Link to="/register" className="pricing-action-btn">
            Comenzar ahora
          </Link>
        </div>

        {/* Plan Estándar */}
        <div className="pricing-card popular">
          <div className="card-header">
            <h3>Plan Estándar</h3>
            <span className="card-target">Complejo deportivo (con 3 a 6 canchas)</span>
          </div>
          <div className="card-price-container">
            <span className="card-price">S/. 139</span>
            <span className="card-period">/ mes</span>
          </div>
          <ul className="card-features">
            <li>Todo lo incluido en el Plan Básico</li>
            <li>Reportes de inteligencia de negocios</li>
            <li>Estadísticas de horas más reservadas</li>
            <li>Análisis de ingresos mensual</li>
          </ul>
          <Link to="/register" className="pricing-action-btn">
            Comenzar ahora
          </Link>
        </div>

        {/* Plan Premium */}
        <div className="pricing-card">
          <div className="card-header">
            <h3>Plan Premium</h3>
            <span className="card-target">Complejo deportivo (con más de 6 canchas)</span>
          </div>
          <div className="card-price-container">
            <span className="card-price">S/. 199</span>
            <span className="card-period">/ mes</span>
          </div>
          <ul className="card-features">
            <li>Reportes avanzados y analítica en tiempo real</li>
            <li>Destacado prioritario en la búsqueda general</li>
            <li>Soporte técnico preferencial</li>
            <li>Módulo de marketing para promociones</li>
          </ul>
          <Link to="/register" className="pricing-action-btn">
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* Secondary Cards Section (Reserva Destacada & Acceso Jugador) */}
      <h2 className="pricing-section-title">Opciones Adicionales y Jugadores</h2>
      <section className="secondary-pricing-section">
        <div className="secondary-grid">
          {/* Reserva Destacada */}
          <div className="pricing-card secondary-card">
            <div className="card-header">
              <h3>Reserva Destacada</h3>
              <span className="card-target">Complejo deportivo</span>
            </div>
            <div className="card-price-container">
              <span className="card-price">S/. 50 - 100</span>
              <span className="card-period">/ semana</span>
            </div>
            <ul className="card-features">
              <li>Aparición prioritaria en los resultados de búsqueda de la plataforma</li>
              <li>Mayor visibilidad para llenar tus horarios menos concurridos</li>
            </ul>
            <Link to="/login" className="pricing-action-btn">
              Adquirir destacado
            </Link>
          </div>

          {/* Acceso Jugador */}
          <div className="pricing-card secondary-card">
            <div className="card-header">
              <h3>Acceso Jugador</h3>
              <span className="card-target">Jugador final</span>
            </div>
            <div className="card-price-container">
              <span className="card-price">Gratuito</span>
            </div>
            <ul className="card-features">
              <li>Sin costo alguno de registro ni de uso de la app</li>
              <li>Busca canchas disponibles en tiempo real</li>
              <li>Reserva y paga de forma segura en menos de 2 minutos</li>
            </ul>
            <Link to="/register" className="pricing-action-btn">
              Registrarme gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Player Reservation CTA Section */}
      <section className="pricing-cta-section">
        <h2>¿Quieres reservar una cancha?</h2>
        <p>Encuentra disponibilidad en tiempo real, reserva de forma segura y asegura tu juego hoy mismo.</p>
        <Link to="/login" className="cta-btn">
          Reserva ahora
        </Link>
      </section>
    </div>
  );
};

export default Pricing;
