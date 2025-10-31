/**
 * App Component - Main Application Router
 * 
 * Defines all application routes and handles global theme updates.
 * This component is responsible for:
 * - Route definitions and navigation
 * - Dark mode theme synchronization with DOM
 * - Protected route authentication
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Route protection wrapper
import './App.css';

function App() {
  // Get dark mode state from Redux store
  const { darkMode } = useSelector((state) => state.theme);

  // Synchronize dark mode with DOM class for Tailwind CSS
  // This effect runs whenever darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark'); // Enable dark mode
    } else {
      document.documentElement.classList.remove('dark'); // Disable dark mode
    }
  }, [darkMode]);

  return (
    <Routes>
      {/* Public routes - Accessible without authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected route - Requires authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Default route - Redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
