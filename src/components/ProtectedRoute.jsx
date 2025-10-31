/**
 * ProtectedRoute Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Route Protection Wrapper
 * 
 * Checks if user is authenticated:
 * - If authenticated: renders the child components (protected content)
 * - If not authenticated: redirects to login page
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} - Either the children or a redirect to login
 */
const ProtectedRoute = ({ children }) => {
  // Get authentication status from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Render children if authenticated, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

