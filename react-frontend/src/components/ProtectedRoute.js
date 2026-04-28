import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * A component that protects routes by checking authentication status
 * and optional role requirements.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to render if authorized.
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access this route.
 * @returns {React.ReactNode} The rendered component or a redirection.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has one of them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user has the wrong role, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
