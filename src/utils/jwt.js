// utils/jwt.js
export const getTokenExpiration = (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем payload
      return payload.exp * 1000; // Переводим в мс (JavaScript работает с мс)
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  };