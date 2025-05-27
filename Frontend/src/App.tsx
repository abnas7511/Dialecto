import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AudioDashboard from './pages/AudioDashboard';
import TextDashboard from './pages/TextDashboard';
import Services from './pages/Services';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/services" 
            element={isAuthenticated ? <Services /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/audio-dashboard" 
            element={isAuthenticated ? <AudioDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/text-dashboard" 
            element={isAuthenticated ? <TextDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;