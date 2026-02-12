import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfileById } from '@redux/slices/profileSlice';
import TemplateSelector from '@components/profile/TemplateSelector';
import ColorSchemeSelector from '@components/profile/ColorSchemeSelector';
import PDFPreview from '@components/profile/PDFPreview';
import { profileService } from '@api/profileService';

export default function TemplatesAndExport() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProfile, loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(Number(id)));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(`/profiles/${id}/edit`);
  };

  const handleTemplateChange = () => {
    // Reload profile to get updated template
    if (id) {
      dispatch(fetchProfileById(Number(id)));
    }
  };

  const handleColorSchemeChange = async (schemeId: string) => {
    try {
      if (id) {
        await profileService.updateProfile(Number(id), { color_scheme: schemeId });
        // Reload profile to get updated color scheme
        dispatch(fetchProfileById(Number(id)));
      }
    } catch (err) {
      console.error('Error updating color scheme:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">{t('profile.notFound')}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={3}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          {t('common.back')}
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          {t('templatesAndExport.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('templatesAndExport.description')}
        </Typography>
      </Box>

      {/* Template Selector Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('templates.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('templates.selectTemplate')}
        </Typography>

        <TemplateSelector
          profileId={currentProfile.id}
          currentTemplate={currentProfile.template as 'harvard_classic' | 'harvard_modern'}
          onTemplateChange={handleTemplateChange}
        />
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Color Scheme Selector Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('colorSchemes.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('colorSchemes.description')}
        </Typography>

        <ColorSchemeSelector
          profileId={currentProfile.id}
          currentScheme={currentProfile.color_scheme || 'harvard_crimson'}
          onSchemeChange={handleColorSchemeChange}
        />
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* PDF Export Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('pdf.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('pdf.description')}
        </Typography>

        <PDFPreview profileId={currentProfile.id} />
      </Paper>
    </Container>
  );
}
