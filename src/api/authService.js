import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const secureStorage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key)
};

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = secureStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: { 'Content-Type': 'application/json' },
// });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = secureStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        authService.logout();
        return Promise.reject(error);
      }

      try {
        // Отправляем refreshToken в теле запроса в указанном формате
        const response = await axios.post(`${API_URL}/refresh`, { 
          refreshToken: refreshToken 
        });
        
        secureStorage.setItem('accessToken', response.data.accessToken);
        secureStorage.setItem('refreshToken', response.data.refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = secureStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        authService.logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
        secureStorage.setItem('accessToken', response.data.accessToken);
        secureStorage.setItem('refreshToken', response.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации'
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      secureStorage.setItem('accessToken', response.data.accessToken);
      secureStorage.setItem('refreshToken', response.data.refreshToken);
      
      return { 
        success: true, 
        data: response.data,
        user: {
          email: credentials.email,
          role: credentials.email === 'admin1@gmail.com' ? 'admin' : 'user' || "manager",
        }
      };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка входа'
      };
    }
  },


 

  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      if (response.status !== 200) {
        throw new Error('Invalid server response');
      }
      return { 
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Token validation failed'
      };
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const { exp } = JSON.parse(decoded);
      return Date.now() >= exp * 1000;
    } catch (e) {
      return true;
    }
  },

  refreshTokens: async () => {
    try {
      const refreshToken = secureStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Нет refresh токена');

      // Отправляем refreshToken в правильном формате
      const response = await axios.post(`${API_URL}/refresh`, { 
        refreshToken: refreshToken 
      });

      if (!response.data?.accessToken || !response.data?.refreshToken) {
        throw new Error('Неверный ответ при обновлении токена');
      }

      secureStorage.setItem('accessToken', response.data.accessToken);
      secureStorage.setItem('refreshToken', response.data.refreshToken);

      return {
        success: true,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка обновления токена'
      };
    }
  },

  getCurrentUserWithRefresh: async () => {
    const accessToken = secureStorage.getItem('accessToken');
    const refreshToken = secureStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) return null;
    
    try {
      // Проверяем, истек ли срок действия access токена
      if (authService.isTokenExpired(accessToken)) {
        // Пытаемся обновить токены
        const refreshResult = await authService.refreshTokens();
        
        if (!refreshResult.success) {
          authService.logout();
          return null;
        }
        
        // Получаем данные пользователя с новым токеном
        const validation = await authService.validateToken();
        return validation.success ? validation.user : null;
      }
      
      // Токен все еще действителен, возвращаем текущего пользователя
      return authService.getCurrentUser();
    } catch (error) {
      console.error('Ошибка проверки пользователя:', error);
      authService.logout();
      return null;
    }
  },

  logout: () => {
    secureStorage.removeItem('accessToken');
    secureStorage.removeItem('refreshToken');
  },

  getCurrentUser: () => {
    const token = secureStorage.getItem('accessToken');
    if (!token) return null;
  
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const { sub, email, roles, exp, username } = JSON.parse(decoded);
    
      let role = 'user'; // По умолчанию роль — "user"
      if (Array.isArray(roles)) {
        if (roles.includes('ROLE_ADMIN')) {
          role = 'admin';
        } else if (roles.includes('ROLE_MANAGER')) {
          role = 'manager';
        }
      }
    
      if (exp && Date.now() >= exp * 1000) {
        secureStorage.removeItem('accessToken');
        return null;
      }
    
      return {
        id: sub,
        email: email || 'unknown',
        username: username,
        role: role
      };
    } catch (e) {
      console.error("Ошибка декодирования токена:", e);
      secureStorage.removeItem('accessToken');
      return null;
    }
  },
  getAccessToken: () => {
    return secureStorage.getItem('accessToken');
  },
  
  getRefreshToken: () => {
    return secureStorage.getItem('refreshToken');
  },

  isAuthenticated: () => {
    return !!secureStorage.getItem('accessToken');
  },

  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user?.role === requiredRole;
  },

  api,
  
  getProtectedData: async () => {
    try {
      const response = await api.get('/v1/protected-endpoint');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка запроса'
      };
    }
  }
};

