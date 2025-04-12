import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Простая проверка аутентификации через localStorage
  const isAuthenticated = localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};