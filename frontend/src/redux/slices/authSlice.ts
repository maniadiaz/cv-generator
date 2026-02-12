import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials, RegisterData } from '@app-types/index';
import { authService } from '@api/authService';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let userData: User | null = null;

if (userStr) {
  try {
    userData = JSON.parse(userStr);
  } catch (e) {
    localStorage.removeItem('user');
  }
}

const initialState: AuthState = {
  user: userData,
  token: token,
  isAuthenticated: !!token, // Set to true if token exists
  loading: !!token, // Set to true if token exists to wait for checkAuth
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { accessToken, refreshToken, user } = await authService.login(credentials);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: accessToken, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      // NO guardar tokens ni usuario en localStorage
      // El usuario debe verificar su correo antes de iniciar sesión
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrarse');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
});

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const user = await authService.checkAuth();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.message || 'Error al verificar autenticación');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Register - DO NOT authenticate, user needs to verify email
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        // No autenticar al usuario después del registro
        // El usuario debe verificar su correo primero
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
