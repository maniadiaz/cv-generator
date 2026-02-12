import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  alpha,
  Fade,
} from '@mui/material';
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { authService } from '@api/authService';
import AppIconSvg from '../../assets/icon.svg';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError(t('auth.verificationLinkInvalid'));
        setVerifying(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || t('auth.emailVerificationError'));
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, t]);

  // Countdown and redirect after successful verification
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
  }, [success, countdown, navigate]);

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
            {verifying && (
              <Fade in>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <Box
                    component="img"
                    src={AppIconSvg}
                    alt="CV Generator"
                    sx={{
                      width: { xs: 60, sm: 70 },
                      height: { xs: 60, sm: 70 },
                      mb: 3,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  />
                  <CircularProgress size={60} sx={{ mb: 3 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    {t('auth.verifyingEmail')}
                  </Typography>
                </Box>
              </Fade>
            )}

            {!verifying && success && (
              <Fade in>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Box
                    component="img"
                    src={AppIconSvg}
                    alt="CV Generator"
                    sx={{
                      width: { xs: 60, sm: 70 },
                      height: { xs: 60, sm: 70 },
                      mb: 2,
                    }}
                  />
                  <SuccessIcon
                    color="success"
                    sx={{
                      fontSize: { xs: 70, sm: 80 },
                      mb: 2,
                      animation: 'scaleIn 0.5s ease-out',
                      '@keyframes scaleIn': {
                        '0%': { transform: 'scale(0)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' },
                      },
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    {t('auth.emailVerificationSuccess')}
                  </Typography>
                  <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                    {t('auth.emailVerified')}
                  </Alert>
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {t('auth.redirectingToLogin', { seconds: countdown })}
                  </Typography>
                </Box>
              </Fade>
            )}

            {!verifying && error && (
              <Fade in>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Box
                    component="img"
                    src={AppIconSvg}
                    alt="CV Generator"
                    sx={{
                      width: { xs: 60, sm: 70 },
                      height: { xs: 60, sm: 70 },
                      mb: 2,
                    }}
                  />
                  <ErrorIcon
                    color="error"
                    sx={{
                      fontSize: { xs: 70, sm: 80 },
                      mb: 2,
                      animation: 'shake 0.5s ease-out',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-10px)' },
                        '75%': { transform: 'translateX(10px)' },
                      },
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    {t('auth.emailVerificationError')}
                  </Typography>
                  <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<LoginIcon />}
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
                      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                      },
                    }}
                  >
                    {t('auth.goToLogin')}
                  </Button>
                </Box>
              </Fade>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
