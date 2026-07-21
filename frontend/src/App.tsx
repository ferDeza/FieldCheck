import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import SportFields from './pages/SportFields';
import AdminDashboard from './pages/AdminDashboard';
import AdminFields from './pages/AdminFields';
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import Payment from './pages/Payment';
import Pricing from './pages/Pricing';

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/pricing" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Tus rutas que ya tenías configuradas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/fields/*" element={
                <ProtectedRoute><AdminFields /></ProtectedRoute>
              } />
              <Route path="/admin/users/*" element={
                <ProtectedRoute><AdminUsers /></ProtectedRoute>
              } />
              <Route path="/admin/bookings/*" element={
                <ProtectedRoute><AdminBookings /></ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute><Bookings /></ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute><Payment /></ProtectedRoute>
              } />
              <Route path="/sport-fields" element={
                <ProtectedRoute><SportFields /></ProtectedRoute>
              } />
              <Route path="/" element={<HomeRedirect />} />
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;