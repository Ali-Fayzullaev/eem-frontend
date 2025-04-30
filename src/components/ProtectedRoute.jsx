// ProtectedRoute.jsx
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const timerRef = useRef(null);

  const checkAuth = async () => {
    try {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();
  
      if (!accessToken || !refreshToken) {
        throw new Error('Токены отсутствуют');
      }
  
      if (authService.isTokenExpired(accessToken)) {
        const refreshResult = await authService.refreshTokens();
        if (!refreshResult.success) {
          throw new Error('Не удалось обновить токен');
        }
      }
  
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Пользователь не найден');
      }
  
      if (adminOnly && !['admin', 'manager'].includes(currentUser.role)) {
        navigate('/user');
        return;
      }
  
      setUser(currentUser);
  
      // Установка таймера для показа модального окна
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
  
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowRefreshModal(true);
      }, expiresIn - 10); 
  
    } catch (err) {
      authService.logout();
      navigate('/login', { 
        state: { from: location, error: err.message }, 
        replace: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (extend) => {
    try {
      if (extend) {
        const result = await authService.refreshTokens();
        if (!result.success) throw new Error('Ошибка обновления токена');
        toast.success('Сессия продлена');
        checkAuth(); // Повторная проверка авторизации
      } else {
        throw new Error('Сессия завершена');
      }
    } catch (err) {
      authService.logout();
      navigate('/login', { 
        state: { from: location, error: err.message }, 
        replace: true 
      });
    } finally {
      setShowRefreshModal(false);
    }
  };

  useEffect(() => {
    checkAuth();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [adminOnly, navigate, location]);

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return null;

  return (
    <>
      {children}
      
      {showRefreshModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Сессия закончилься</h5>
              </div>
              <div className="modal-body">
                <p>Ваша сессия время закончилься. Продлить?</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleRefresh(false)}
                >
                  Выйти
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleRefresh(true)}
                >
                  Продлить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};