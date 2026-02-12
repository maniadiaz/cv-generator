import api from './axios';
import type { LoginCredentials, RegisterData, User, ApiResponse } from '@app-types/index';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    return response.data.data;
  },

  // Register
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post<ApiResponse<RegisterResponse>>('/api/auth/register', data);
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  // Check authentication
  checkAuth: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/refresh-token', {
      refreshToken,
    });
    return response.data.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.get(`/api/auth/verify-email/${token}`);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/api/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/api/auth/reset-password', { token, password });
  },
};
