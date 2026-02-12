import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { register as registerAction, checkAuth } from '@redux/slices/authSlice';
import type { RegisterData } from '@app-types/index';
import AppIconSvg from '../../assets/icon.svg';

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const schema = yup.object({
  first_name: yup.string().required('auth.firstNameRequired'),
  last_name: yup.string().required('auth.lastNameRequired'),
  email: yup
    .string()
    .email('auth.emailInvalid')
    .required('auth.emailRequired'),
  password: yup
    .string()
    .min(8, 'auth.passwordMin')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'auth.passwordRequirements'
    )
    .required('auth.passwordRequired'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'auth.passwordsMustMatch')
    .required('auth.confirmPasswordRequired'),
});

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          // Token is invalid, user stays on register page
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

  // Countdown and redirect after successful registration
  useEffect(() => {
    if (registrationSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (registrationSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [registrationSuccess, countdown, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      // Exclude confirmPassword from the data sent to the backend
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerAction(registerData)).unwrap();
      // Show success message and start countdown (handled by useEffect)
      setRegistrationSuccess(true);
    } catch (err: any) {
      setError(err || t('auth.registerError'));
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={AppIconSvg}
                alt="CV Generator"
                sx={{
                  width: { xs: 60, sm: 70 },
                  height: { xs: 60, sm: 70 },
                  mb: 2,
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
                {t('auth.register')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {t('auth.createAccount') || 'Crea tu cuenta'}
              </Typography>
            </Box>

            {error && (
              <Fade in>
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {registrationSuccess && (
              <Fade in>
                <Box sx={{ width: '100%', mb: 3 }}>
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {t('auth.registerSuccess')}. {t('auth.checkEmailToVerify')}
                  </Alert>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {t('auth.redirectingToLogin', { seconds: countdown })}
                  </Typography>
                </Box>
              </Fade>
            )}

            {!registrationSuccess && (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('common.firstName')}
                        autoComplete="given-name"
                        autoFocus
                        error={!!errors.first_name}
                        helperText={errors.first_name ? t(errors.first_name.message as string) : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
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
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('common.lastName')}
                        autoComplete="family-name"
                        error={!!errors.last_name}
                        helperText={errors.last_name ? t(errors.last_name.message as string) : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
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
                </Box>

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
                      autoComplete="new-password"
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

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label={t('common.confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword ? t(errors.confirmPassword.message as string) : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={!isSubmitting && <RegisterIcon />}
                  sx={{
                    mt: 3,
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    textTransform: 'none',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                    '&:disabled': {
                      background: (theme) => theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('auth.register')}
                </Button>

                <Box
                  sx={{
                    textAlign: 'center',
                    pt: 2,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" component="span">
                    {t('auth.alreadyHaveAccount')}{' '}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {t('auth.login')}
                  </Link>
                </Box>
              </Box>
            )}

            {registrationSuccess && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.goToLogin')}
                </Link>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
