// axiosInstance
import axios from 'axios';
import { toast } from 'react-toastify';

// Базовый URL для API
const BASE_URL = "http://localhost:8080/api/v1/admin";
// Axios инстанцияни яратиш
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request интерсептор (хар бир суровга токен куйиш)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response интерсептор (401 хатолигида токенни янгилаш)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 хатолиги ва ретрай этилмаган суровлар учун
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("Refresh token topilmadi");

        // Янги accessToken олиш
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        
        // Янги токенни сақлаш
        localStorage.setItem('accessToken', data.accessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // Оригинал суровни қайта уриниш
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Рефреш токен ҳам ишламаса, чиқиш
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Сессия тугади, қайта киринг');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Бошқа хатоликларни узатиш
    return Promise.reject(error);
  }
);

export default axiosInstance;