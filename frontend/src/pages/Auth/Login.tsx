import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { analyticsEvents } from '@utils/analytics';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  alpha,
  Fade,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { login, checkAuth } from '@redux/slices/authSlice';
import type { LoginCredentials } from '@app-types/index';
import AppIconSvg from '../../assets/icon.svg';

const schema = yup.object({
  email: yup
    .string()
    .email('auth.emailInvalid')
    .required('auth.emailRequired'),
  password: yup
    .string()
    .min(8, 'auth.passwordMin')
    .required('auth.passwordRequired'),
});

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if user is already authenticated
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await dispatch(checkAuth()).unwrap();
          navigate('/dashboard');
        } catch (err) {
          // Token is invalid, user stays on login page
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    verifyToken();
  }, [dispatch, navigate]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError(null);
      const result = await dispatch(login(data)).unwrap();
      if (result) {
        // Track successful login
        analyticsEvents.login('email');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err || t('auth.loginError'));
      // Track login error
      analyticsEvents.error('Login Error', err || 'Unknown error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in timeout={600}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.9)
                  : alpha('#ffffff', 0.95),
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {/* Logo y Título */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={AppIconSvg}
                alt="CV Generator"
                sx={{
                  width: { xs: 70, sm: 200 },
                  height: { xs: 70, sm: 200 },
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                  },
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {t('auth.login')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {t('auth.welcomeBack') || 'Bienvenido de nuevo'}
              </Typography>
            </Box>

            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label={t('common.email')}
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email ? t(errors.email.message as string) : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label={t('common.password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password ? t(errors.password.message as string) : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.forgotPassword')}
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={!isSubmitting && <LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  textTransform: 'none',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  boxShadow: (theme) =>
                    `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) =>
                      `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                  '&:disabled': {
                    background: (theme) => theme.palette.action.disabledBackground,
                  },
                  mb: 3,
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('auth.login')}
              </Button>

              <Box
                sx={{
                  textAlign: 'center',
                  pt: 2,
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" color="text.secondary" component="span">
                  {t('auth.dontHaveAccount')}{' '}
                </Typography>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.register')}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
