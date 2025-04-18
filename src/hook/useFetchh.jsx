// import { useEffect, useState, useCallback } from "react";

// function useFetch(url, options = {}) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

  

//   const fetchData = useCallback(async () => {
//     if (!url) {
//       setError(new Error("URL is required"));
//       return;
//     }
    
//     setLoading(true);
//     setError(null);

//     try {
//       // LocalStorageдан токенни оламиз
//       const token = localStorage.getItem('accessToken');
      
//       const headers = {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       };

//       // Агар токен мавжуд булса, Authorization headerга куямиз
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       const response = await fetch(url, {
//         ...options,
//         headers,
//       });

//       if (!response.ok) {
//         // 401 - Unauthorized (токен eski yoki noto'g'ri)
//         if (response.status === 401) {
//           throw new Error("Session expired. Please login again.");
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      

//       const responseData = await response.json();
//       setData(responseData);
//     } catch (err) {
//       setError(err.message);
//       console.error("Fetch error:", err.message);
      
//       // Агар токен eski булса, foydalanuvчини loginга йуналтирамиз
//       if (err.message.includes("Session expired")) {
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login';
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [url, options]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch: fetchData };
// }

// export default useFetch;

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from './AxiosInstance';

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;