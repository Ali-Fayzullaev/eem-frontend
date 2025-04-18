// AdminProtectedRoute.jsx
export const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Проверяем роль администратора
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};