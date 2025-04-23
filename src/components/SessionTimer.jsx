// SessionTimer.jsx
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from 'react';

export const SessionTimer = ({ remainingTime }) => {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (remainingTime === null) return;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    setDisplayTime(`${minutes}м ${seconds < 10 ? '0' : ''}${seconds}с`);
  }, [remainingTime]);

  if (!remainingTime) return null;

  return (
    <div className="session-timer">
    <Toaster />
    <ToastContainer />
    {/* <span className={`badge ${remainingTime <= 60000 ? "bg-danger" : "bg-info"}`}>
      {displayTime}
    </span> */}
  </div>
  );
};