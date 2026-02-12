import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  alpha,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfiles, deleteProfile } from '@redux/slices/profileSlice';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import CreateProfileDialog from '@components/profile/CreateProfileDialog';
import ExportModal from '@components/profile/ExportModal';

const ProfileList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profiles, loading } = useAppSelector((state) => state.profile);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [profileToExport, setProfileToExport] = useState<number | null>(null);

  const dateLocale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleCreateProfile = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleEditProfile = (id: number) => {
    navigate(`/profiles/${id}/edit`);
  };

  const handleDeleteClick = (id: number) => {
    setProfileToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (profileToDelete) {
      await dispatch(deleteProfile(profileToDelete));
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
  };

  const handleExportClick = (id: number) => {
    setProfileToExport(id);
    setExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setExportModalOpen(false);
    setProfileToExport(null);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage < 30) return 'error';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 0, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3, md: 4 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 },
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
            width: { xs: '100%', sm: 'auto' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {t('dashboard.myProfiles')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateProfile}
          sx={{
            borderRadius: 2,
            px: { xs: 2.5, sm: 3 },
            py: { xs: 1.25, sm: 1.5 },
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            width: { xs: '100%', sm: 'auto' },
            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {t('profile.newProfile')}
        </Button>
      </Box>

      {!profiles || profiles.length === 0 ? (
        <Fade in timeout={600}>
          <Card 
            elevation={0}
            sx={{ 
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 10 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('dashboard.noProfiles')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                {t('dashboard.createFirstProfile')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateProfile}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                {t('profile.newProfile')}
              </Button>
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(profiles) && profiles.map((profile, index) => (
            <Grid key={profile.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Fade in timeout={400 + index * 100}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          noWrap
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {profile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profile.template}
                        </Typography>
                      </Box>
                      {profile.is_default && (
                        <Chip 
                          label={t('profile.default')} 
                          size="small" 
                          color="primary"
                          sx={{ 
                            fontWeight: 600,
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {t('profile.completion')}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight={700}
                          color={getCompletionColor(profile.completion_percentage) + '.main'}
                        >
                          {profile.completion_percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={profile.completion_percentage}
                        color={getCompletionColor(profile.completion_percentage)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                      <Chip
                        icon={<PreviewIcon sx={{ fontSize: 16 }} />}
                        label={`${profile.download_count} ${t('profile.downloads')}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 2, 
                        display: 'block',
                        fontSize: '0.75rem',
                      }}
                    >
                      {t('profile.lastUpdated')}: {format(new Date(profile.updated_at), 'PPp', { locale: dateLocale })}
                    </Typography>
                  </CardContent>

                  <CardActions 
                    sx={{ 
                      justifyContent: 'space-between', 
                      px: 3, 
                      pb: 3,
                      pt: 2,
                      borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                      gap: 1,
                    }}
                  >
                    <Tooltip title={t('profile.exportPDF')} arrow>
                      <IconButton
                        size="medium"
                        onClick={() => handleExportClick(profile.id)}
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'success.main',
                            color: 'success.contrastText',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <ExportIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('common.edit')} arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleEditProfile(profile.id)}
                          sx={{
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('profile.deleteProfile')} arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleDeleteClick(profile.id)}
                          sx={{
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'error.main',
                              color: 'error.contrastText',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProfileDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
      />

      {profileToExport && (
        <ExportModal
          open={exportModalOpen}
          onClose={handleCloseExportModal}
          profileId={profileToExport}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>{t('profile.deleteProfile')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('profile.deleteConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileList;