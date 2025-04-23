// ProtectedRoute.jsx
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';
import { SessionTimer } from './SessionTimer';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const refreshTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Вақтни янгилаш функцияси
  const updateRemainingTime = () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
  
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    const now = Date.now();
    const newRemaining = Math.max(0, expiresAt - now);
  
    console.log('Updating remaining time:', { expiresAt, now, newRemaining }); // Дебаг маълумоти
  
    setRemainingTime(newRemaining);
  };

  // Сессияни узайтириш ёки чиқиш функцияси
  const handleRefreshSession = async (extend) => {
    try {
      if (extend) {
        const refreshResult = await authService.refreshTokens();
        console.log('Refresh result:', refreshResult); // Debugging
        if (!refreshResult.success) throw new Error('Token refresh failed');
        const validation = await authService.validateToken();
        console.log('Validation result:', validation); // Debugging
        if (!validation.success) throw new Error('Token validation failed');
        setUser(validation.user);
        // Reset interval
        clearInterval(timerIntervalRef.current);
        updateRemainingTime();
        timerIntervalRef.current = setInterval(updateRemainingTime, 1000);
        toast.success("Сессия 15 минутга узайтирилди");
      } else {
        throw new Error('Сессия тугатилди');
      }
    } catch (err) {
      console.error('Session refresh error:', err.message); // Debugging
      authService.logout();
      navigate('/login', {
        state: { from: location, error: err.message },
        replace: true
      });
    } finally {
      setShowRefreshModal(false);
    }
  };


  // Асосий аутентификация текшируви
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUserWithRefresh();
        if (!currentUser) throw new Error('Not authenticated');
  
        // Агар adminOnly=true ва фойдаланувчи админ/менежер бўлмаса
        if (adminOnly && !["admin", "manager"].includes(currentUser.role)) {
          navigate('/user'); // Ушбу йўлга ўтказиб юбориш
          return; // Кейинги кодни ишламаслик учун
        }
  
        setUser(currentUser);
        updateRemainingTime();

        // Олдинги таймерни тозалаш
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

        const accessToken = authService.getAccessToken();
        if (accessToken) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expiresIn = payload.exp * 1000 - Date.now();

          // 1 минут олдин модални кўрсатиш
          refreshTimeoutRef.current = setTimeout(() => {
            setShowRefreshModal(true);
          }, expiresIn - 60000);
        }
      } catch (err) {
        authService.logout();
        navigate('/login', { state: { from: location, error: err.message }, replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      clearTimeout(refreshTimeoutRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [adminOnly, navigate, location]);

  // Вақтни ҳар секундда янгилаш
  useEffect(() => {
    timerIntervalRef.current = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  // Модал кўрсатилганда автологаут таймери

  useEffect(() => {
    if (!showRefreshModal) return;
    const autoLogoutTimeout = setTimeout(() => {
      handleRefreshSession(false);
    }, 60000); // 1 minute = 60000 ms
    return () => clearTimeout(autoLogoutTimeout);
  }, [showRefreshModal]);

  if (isLoading) {
    return <div className="loading-spinner">loading...</div>;
  }

  if (!user) return null;

  return (
    <>
      {/* Вақтни экраннинг юқори оң тарфига кўрсатиш */}
      <div>
        <SessionTimer remainingTime={remainingTime} />
      </div>

      {children}

      {/* Сессия узайтириш модали */}
      {showRefreshModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">As the session is about to end</h5>
              </div>
              <div className="modal-body">
                <p>The session will end in 1 minute. Would you like to extend it?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRefreshSession(false)}
                >
                  No, log out.
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleRefreshSession(true)}
                >
                  Yes, extend it.
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};