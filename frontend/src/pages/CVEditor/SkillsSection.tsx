import { useEffect, useCallback } from 'react';
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
import SkillsForm from '@components/profile/SkillsForm';
import ProfileCompletionCard from '@components/profile/ProfileCompletionCard';

const SkillsSection = () => {
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

  const handleSaveSuccess = useCallback(() => {
    if (id) {
      dispatch(updateProfileCompletion(Number(id)));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(`/profiles/${id}/edit`);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h4">{t('skills.title')}</Typography>
      </Box>

      <ProfileCompletionCard
        completionPercentage={currentProfile.completion_percentage || 0}
      />

      <Paper sx={{ p: 3 }}>
        <SkillsForm
          profileId={currentProfile.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Paper>
    </Container>
  );
};

export default SkillsSection;
