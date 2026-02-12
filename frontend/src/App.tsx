import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { checkAuth } from '@redux/slices/authSlice';
import { lightTheme, darkTheme } from '@theme/theme';
import AppRoutes from '@routes/AppRoutes';
import PWAUpdatePrompt from '@components/common/PWAUpdatePrompt';
import { initGA, logPageView } from '@utils/analytics';
import '@i18n/config';

// Componente para rastrear cambios de ruta
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
}

function App() {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    dispatch(checkAuth());
    // Inicializar Google Analytics
    initGA();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <BrowserRouter>
          <AnalyticsTracker />
          <AppRoutes />
          <PWAUpdatePrompt />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
