import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  alpha,
  Fade,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Email as EmailIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { authService } from '@api/authService';
import AppIconSvg from '../../assets/icon.svg';

interface ForgotPasswordForm {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('auth.emailInvalid')
    .required('auth.emailRequired'),
});

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError(null);
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.forgotPasswordError'));
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
                {t('auth.forgotPassword')}
              </Typography>
              {!success && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', maxWidth: 400 }}
                >
                  {t('auth.forgotPasswordInstructions')}
                </Typography>
              )}
            </Box>

            {error && (
              <Fade in>
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in>
                <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                  {t('auth.forgotPasswordSuccess')}
                </Alert>
              </Fade>
            )}

            {!success && (
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={!isSubmitting && <SendIcon />}
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
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('auth.sendResetLink')}
                </Button>

                <Box
                  sx={{
                    textAlign: 'center',
                    pt: 2,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <BackIcon sx={{ fontSize: 18 }} />
                    {t('auth.backToLogin')}
                  </Link>
                </Box>
              </Box>
            )}

            {success && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <BackIcon sx={{ fontSize: 18 }} />
                  {t('auth.backToLogin')}
                </Link>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
