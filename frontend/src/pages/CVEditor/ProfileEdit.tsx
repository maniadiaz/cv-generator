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
  Grid,
  Fade,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  EmojiObjects as SkillsIcon,
  Language as LanguageIcon,
  CardMembership as CertificateIcon,
  Group as SocialIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfileById, updateProfileCompletion } from '@redux/slices/profileSlice';
import PersonalInfoForm from '@components/profile/PersonalInfoForm';
import SectionCard from '@components/profile/SectionCard';
import ProfileCompletionCard from '@components/profile/ProfileCompletionCard';

const ProfileEdit = () => {
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
    // Update only completion percentage without reloading entire profile
    if (id) {
      dispatch(updateProfileCompletion(Number(id)));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/dashboard');
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Fade in timeout={400}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<BackIcon />}
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('common.back')}
              </Button>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {currentProfile.name}
              </Typography>
            </Box>
          </Box>

          {/* Completion Progress Card */}
          <ProfileCompletionCard
            completionPercentage={currentProfile.completion_percentage || 0}
          />

          {/* Personal Info Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 4,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                pb: 2,
                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
              }}
            >
              {t('personalInfo.title')}
            </Typography>
            <PersonalInfoForm
              profileId={currentProfile.id}
              onSaveSuccess={handleSaveSuccess}
            />
          </Paper>

          {/* CV Sections Cards */}
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mt: 2, 
              mb: 3,
              fontWeight: 700,
            }}
          >
            {t('profile.cvSections')}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('experience.title')}
                description={t('experience.sectionDescription')}
                icon={WorkIcon}
                path={`/profiles/${id}/experience`}
                color="primary"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('education.title')}
                description={t('education.sectionDescription')}
                icon={SchoolIcon}
                path={`/profiles/${id}/education`}
                color="success"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('skills.title')}
                description={t('skills.sectionDescription')}
                icon={SkillsIcon}
                path={`/profiles/${id}/skills`}
                color="info"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('languages.title')}
                description={t('languages.sectionDescription')}
                icon={LanguageIcon}
                path={`/profiles/${id}/languages`}
                color="warning"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('certificates.title')}
                description={t('certificates.sectionDescription')}
                icon={CertificateIcon}
                path={`/profiles/${id}/certifications`}
                color="secondary"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <SectionCard
                title={t('socialNetworks.title')}
                description={t('socialNetworks.sectionDescription')}
                icon={SocialIcon}
                path={`/profiles/${id}/social-networks`}
                color="primary"
              />
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default ProfileEdit;
