import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';
import logoCanchaYa from '../assests/canchaYa-remove.png';

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmacion = window.confirm("¿Quieres salir de la sesión?");
    if (confirmacion) {
      logout();
      navigate('/login');
    }
  };

  // Función para manejar las clases activas de forma limpia
  const getNavLinkClass = ({ isActive }) => 
    isActive ? 'nav-link active-tab' : 'nav-link';

  // Verificar si el usuario es admin
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img 
            src={logoCanchaYa} 
            alt="CanchaYa" 
            className="logo-icon" 
            style={{ height: '120px' }} 
          />
        </Link>

        {isAuthenticated ? (
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/dashboard" className={getNavLinkClass}>Inicio</NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink to="/admin-dashboard" className={getNavLinkClass}>
                  📊 Admin
                </NavLink>
              </li>
            )}
            {!isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink to="/sport-fields" className={getNavLinkClass}>Canchas</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/bookings" className={getNavLinkClass}>Mis Reservas</NavLink>
                </li>
              </>
            )}
            <li className="nav-item user-menu">
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Salir
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/pricing" className={getNavLinkClass}>
                Planes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className={getNavLinkClass}>
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/register" className={getNavLinkClass}>
                Registro
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
