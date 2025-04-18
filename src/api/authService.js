//authService
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

// Безопасное хранилище
const secureStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  }
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
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Login response:', response.data);
      
      secureStorage.setItem('accessToken', response.data.accessToken);
      secureStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Проверка сохранения
      console.log('Stored accessToken:', secureStorage.getItem('accessToken'));
      console.log('Stored refreshToken:', secureStorage.getItem('refreshToken'));
      
      return { 
        success: true, 
        data: response.data,
        user: {
          email: credentials.email,
          role: credentials.email === 'admin1@gmail.com' ? 'admin' : 'user'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },


  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return { 
        success: true,
        user: response.data
      };
    } catch (error) {
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
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
      if (!response.data?.accessToken || !response.data?.refreshToken) {
        throw new Error('Invalid token refresh response');
      }
      
      secureStorage.setItem('accessToken', response.data.accessToken);
      secureStorage.setItem('refreshToken', response.data.refreshToken);
      
      return {
        success: true,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  },
  

 
  getCurrentUserWithRefresh: async () => {
    const accessToken = secureStorage.getItem('accessToken');
    const refreshToken = secureStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) return null;
    
    try {
      // Check if access token is expired
      if (authService.isTokenExpired(accessToken)) {
        // Attempt to refresh tokens
        const refreshResult = await authService.refreshTokens();
        
        if (!refreshResult.success) {
          authService.logout();
          return null;
        }
        
        // Get new user data with fresh token
        const validation = await authService.validateToken();
        return validation.success ? validation.user : null;
      }
      
      // Token is still valid, return current user
      return authService.getCurrentUser();
    } catch (error) {
      console.error('User validation error:', error);
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
      const { sub, email, roles, exp } = JSON.parse(decoded);
  
      if (exp && Date.now() >= exp * 1000) {
        secureStorage.removeItem('accessToken');
        return null;
      }
  
      // Ролни текшириш
      const isAdmin = Array.isArray(roles)
        ? roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')
        : false;
  
      return {
        id: sub,
        email: email || 'unknown', // Email мавжудлигини таъминлаш
        role: isAdmin ? 'admin' : 'user'
      };
    } catch (e) {
      console.error("Token decoding error:", e);
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
        error: error.response?.data?.message || 'Request failed'
      };
    }
  }
};