// SessionTimer.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

export const SessionTimer = ({ remainingTime }) => {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (remainingTime === null) return;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    
    setDisplayTime(`${minutes}m ${seconds}s`);

    // Show warning when session is about to expire
    if (remainingTime < 300000 && remainingTime > 299000) { // 5 minutes left
      toast.warn('Your session will expire in 5 minutes');
    }
  }, [remainingTime]);

  if (!remainingTime) return null;

  return (
    <div className="session-timer fixed-top text-end pe-3 pt-2" style={{ zIndex: 1060 }}>
        <Toaster />
        <ToastContainer />
      <div className={`badge ${ remainingTime <= 300000 ? "bg-danger" : "bg-custom" }`}>
        <i className="bi bi-clock me-2"></i>
        {displayTime}
      </div>
    </div>
  );
};