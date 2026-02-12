import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfileById, updateProfileCompletion } from '@redux/slices/profileSlice';
import CertificationsForm from '@components/profile/CertificationsForm';
import ProfileCompletionCard from '@components/profile/ProfileCompletionCard';

const CertificationsSection = () => {
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

  const handleSaveSuccess = async () => {
    if (id) {
      await dispatch(updateProfileCompletion(Number(id)));
    }
  };

  if (loading && !currentProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">{t('profile.notFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          variant="outlined"
        >
          {t('common.back')}
        </Button>
        <Typography variant="h4" component="h1">
          {t('certificates.title')}
        </Typography>
      </Box>

      <ProfileCompletionCard
        completionPercentage={currentProfile.completion_percentage || 0}
      />

      <Paper sx={{ p: 3 }}>
        <CertificationsForm
          profileId={currentProfile.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Paper>
    </Container>
  );
};

export default CertificationsSection;
