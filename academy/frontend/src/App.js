import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={
            token ? <Navigate to="/dashboard" /> : <Login onLogin={login} />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute token={token} logout={logout}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute token={token} logout={logout}>
              <Students />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
