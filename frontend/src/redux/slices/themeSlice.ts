import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeState, ThemeMode } from '@app-types/index';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme) return savedTheme;

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
