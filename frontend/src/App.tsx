import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import SportFields from './pages/SportFields';


function App() {
  // --- AQUÍ PEGA LA LÓGICA QUE TENÍAS EN EL JSX ---
  // Ejemplo: const [user, setUser] = useState(null); 
  
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
              
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute><Bookings /></ProtectedRoute>
              } />
              <Route path="/sport-fields" element={
                <ProtectedRoute><SportFields /></ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;