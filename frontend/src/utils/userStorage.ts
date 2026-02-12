import type { User } from '@app-types/index';

/**
 * Servicio para obtener el usuario desde localStorage
 * Útil para recuperar datos del usuario cuando Redux aún no está inicializado
 */
export const userStorage = {
  /**
   * Obtiene el usuario desde localStorage
   * @returns User object o null si no existe o hay error
   */
  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return null;
      }
      const parsed = JSON.parse(userStr);
      // Extraer el objeto user interno si existe
      return parsed.user ? parsed.user as User : parsed as User;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  /**
   * Obtiene el token desde localStorage
   * @returns token string o null si no existe
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Verifica si hay un usuario autenticado en localStorage
   * @returns true si existe usuario y token
   */
  isAuthenticated: (): boolean => {
    const user = userStorage.getUser();
    const token = userStorage.getToken();
    return !!user && !!token;
  },
};
