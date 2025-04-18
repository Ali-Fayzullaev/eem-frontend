
// // ProtectedRoute.jsx
// import { useLocation, Navigate, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { authService } from '../api/authService';
// import { toast } from 'react-toastify';
// import { SessionTimer } from './SessionTimer'; // We'll create this component

// export const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [showRefreshModal, setShowRefreshModal] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(null);

//   const updateRemainingTime = (accessToken) => {
//     if (!accessToken) return;
    
//     const payload = JSON.parse(atob(accessToken.split('.')[1]));
//     const expiresAt = payload.exp * 1000;
//     const now = Date.now();
//     setRemainingTime(Math.max(0, expiresAt - now));
//   };

//   const handleRefreshSession = async (extend) => {
//     try {
//       if (extend) {
//         const refreshResult = await authService.refreshTokens();
//         if (!refreshResult.success) throw new Error('Refresh failed');
        
//         const validation = await authService.validateToken();
//         if (!validation.success) throw new Error('Validation failed');
        
//         setUser(validation.user);
//         updateRemainingTime(authService.getAccessToken());
//         toast.success("Session extended for 15 more minutes");
//       } else {
//         throw new Error('User declined session extension');
//       }
//     } catch (err) {
//       authService.logout();
//       navigate('/login', { 
//         state: { 
//           from: location,
//           error: 'Session expired. Please login again.' 
//         }, 
//         replace: true 
//       });
//     } finally {
//       setShowRefreshModal(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         console.log('Checking authentication...');
//         const currentUser = await authService.getCurrentUserWithRefresh();
//         console.log('Current user:', currentUser);
  
//         if (!currentUser) {
//           throw new Error('Not authenticated');
//         }
  
//         if (adminOnly && currentUser.role !== 'admin') {
//           throw new Error('Admin access required');
//         }
  
//         setUser(currentUser);
//         updateRemainingTime(authService.getAccessToken());
  
//         // Token expiration check
//         const accessToken = authService.getAccessToken();
//         if (accessToken) {
//           const payload = JSON.parse(atob(accessToken.split('.')[1]));
//           const expiresIn = payload.exp * 1000 - Date.now();
  
//           // Show modal 1 minute before expiration
//           const refreshTimeout = setTimeout(() => {
//             setShowRefreshModal(true);
//           }, expiresIn - 60000);
  
//           return () => clearTimeout(refreshTimeout);
//         }
//       } catch (err) {
//         console.error('Authentication error:', err.message);
//         authService.logout();
//         navigate('/login', {
//           state: {
//             from: location,
//             error: err.message
//           },
//           replace: true
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     checkAuth();
    
//     // Update remaining time every second
//     const timerInterval = setInterval(() => {
//       if (remainingTime > 0) {
//         setRemainingTime(prev => prev - 1000);
//       }
//     }, 1000);
    
//     return () => clearInterval(timerInterval);
//   }, [adminOnly, navigate, location, remainingTime]);

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <>
//       <SessionTimer remainingTime={remainingTime} />
//       {children}
      
//       {showRefreshModal && (
//         <div className="modal show d-block" tabIndex="-1">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Session Expiring Soon</h5>
//               </div>
//               <div className="modal-body">
//                 <p>Your session will expire in 1 minute. Would you like to extend it?</p>
//               </div>
//               <div className="modal-footer">
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => handleRefreshSession(false)}
//                 >
//                   Logout
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn btn-primary"
//                   onClick={() => handleRefreshSession(true)}
//                 >
//                   Extend Session
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };


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
  
  // Используем ref для хранения таймеров
  const refreshTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const updateRemainingTime = () => {
    const accessToken = authService.getAccessToken();
    if (!accessToken) return;
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    const now = Date.now();
    setRemainingTime(Math.max(0, expiresAt - now));
  };

  const handleRefreshSession = async (extend) => {
    try {
      if (extend) {
        const refreshResult = await authService.refreshTokens();
        if (!refreshResult.success) throw new Error('Refresh failed');
        
        const validation = await authService.validateToken();
        if (!validation.success) throw new Error('Validation failed');
        
        setUser(validation.user);
        updateRemainingTime();
        toast.success("Session extended for 15 more minutes");
      } else {
        throw new Error('User declined session extension');
      }
    } catch (err) {
      authService.logout();
      navigate('/login', { 
        state: { 
          from: location,
          error: 'Session expired. Please login again.' 
        }, 
        replace: true 
      });
    } finally {
      setShowRefreshModal(false);
    }
  };

  // Основной эффект для проверки аутентификации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const currentUser = await authService.getCurrentUserWithRefresh();
        console.log('Current user:', currentUser);

        if (!currentUser) throw new Error('Not authenticated');
        if (adminOnly && currentUser.role !== 'admin') {
          throw new Error('Admin access required');
        }

        setUser(currentUser);
        updateRemainingTime();

        // Очищаем предыдущие таймеры
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        const accessToken = authService.getAccessToken();
        if (accessToken) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expiresIn = payload.exp * 1000 - Date.now();

          // Устанавливаем новый таймаут
          refreshTimeoutRef.current = setTimeout(() => {
            setShowRefreshModal(true);
          }, expiresIn - 60000);
        }
      } catch (err) {
        console.error('Authentication error:', err.message);
        authService.logout();
        navigate('/login', {
          state: {
            from: location,
            error: err.message
          },
          replace: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Очистка при размонтировании
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [adminOnly, navigate, location]);

  // Эффект для обновления таймера
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <SessionTimer remainingTime={remainingTime} />
      {children}
      
      {showRefreshModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Session Expiring Soon</h5>
              </div>
              <div className="modal-body">
                <p>Your session will expire in 1 minute. Would you like to extend it?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => handleRefreshSession(false)}
                >
                  Logout
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => handleRefreshSession(true)}
                >
                  Extend Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};