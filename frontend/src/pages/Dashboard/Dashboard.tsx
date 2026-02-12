import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  alpha,
} from '@mui/material';
import {
  Folder as FolderIcon,
  TrendingUp as TrendingIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfiles } from '@redux/slices/profileSlice';
import { userStorage } from '@utils/userStorage';
import ProfileList from './ProfileList';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { profiles } = useAppSelector((state) => state.profile);

  // Obtener usuario desde localStorage o Redux
  const user = userStorage.getUser();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const totalProfiles = profiles.length;
  const avgCompletion = totalProfiles > 0
    ? Math.round(
        profiles.reduce((sum, p) => {
          const percentage = Number(p.completion_percentage);
          return sum + (isNaN(percentage) ? 0 : percentage);
        }, 0) / totalProfiles
      )
    : 0;
  const totalExports = profiles.reduce((sum, p) => {
    const count = Number(p.download_count);
    return sum + (isNaN(count) ? 0 : count);
  }, 0);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ mt: { xs: 2 }, mb: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2 } }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
            borderRadius: { xs: 2, sm: 3 },
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: { xs: 0.5, sm: 1 },
              wordBreak: 'break-word',
            }}
          >
            {t('common.welcome')}, {user?.first_name || user?.name || t('common.user')}!
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' },
            }}
          >
            {t('dashboard.title')}
          </Typography>
        </Paper>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: { xs: 2, sm: 3 },
          mb: 4
        }}>
          <Card 
            elevation={0}
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
                borderColor: 'primary.main',
                '& .view-profiles-btn': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
              },
            }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {t('dashboard.totalProfiles')}
                  </Typography>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <FolderIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} color="primary" sx={{ mb: 2 }}>
                  {totalProfiles}
                </Typography>
              </CardContent>
            </Card>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t('dashboard.avgCompletion')}
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                  }}
                >
                  <TrendingIcon sx={{ color: 'success.main', fontSize: 28 }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {avgCompletion}%
              </Typography>
            </CardContent>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FF9800 0%, #FFC107 100%)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t('dashboard.totalExports')}
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                  }}
                >
                  <DownloadIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {totalExports}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box id="profiles-section">
        <ProfileList />
      </Box>
    </Box>
  );
};

export default Dashboard;