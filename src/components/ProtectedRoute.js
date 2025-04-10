import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../api/authService'; 

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!authService || typeof authService.isAuthenticated !== 'function') {
    console.error('authService.isAuthenticated is not a function');
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// УШБУ ҚАТОРНИ ЎЧИРИБ ЮБОР: <Navigate to="/login" state={{ from: location }} replace />;
