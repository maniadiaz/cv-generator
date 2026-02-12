import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Language as LanguageIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { socialNetworksService } from '@api/socialNetworksService';
import { updateProfileCompletion } from '@redux/slices/profileSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import type { SocialNetwork, SocialPlatform } from '@app-types/index';
import SocialNetworksForm from '@components/profile/SocialNetworksForm';
import ProfileCompletionCard from '@components/profile/ProfileCompletionCard';
import { useAppSelector } from '@hooks/useAppSelector';

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  gitlab: <GitHubIcon />,
  twitter: <TwitterIcon />,
  portfolio: <LanguageIcon />,
  stackoverflow: <LanguageIcon />,
  medium: <LanguageIcon />,
  youtube: <YouTubeIcon />,
  behance: <LanguageIcon />,
  dribbble: <LanguageIcon />,
  other: <LanguageIcon />,
};

export default function SocialNetworksSection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profileId = Number(id);
  const { currentProfile } = useAppSelector((state) => state.profile);

  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSocialNetwork, setEditingSocialNetwork] = useState<SocialNetwork | null>(null);

  const fetchSocialNetworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await socialNetworksService.getSocialNetworks(profileId);
      setSocialNetworks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('socialNetworks.errors.loadFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profileId, t]);

  useEffect(() => {
    fetchSocialNetworks();
  }, [fetchSocialNetworks]);

  const handleCreate = async (data: Omit<SocialNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    const newSocialNetwork = await socialNetworksService.createSocialNetwork(profileId, data);
    setSocialNetworks((prev) => [...prev, newSocialNetwork]);
    dispatch(updateProfileCompletion(profileId));
  };

  const handleUpdate = async (data: Omit<SocialNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingSocialNetwork) return;

    const updated = await socialNetworksService.updateSocialNetwork(profileId, editingSocialNetwork.id, data);
    setSocialNetworks((prev) =>
      prev.map((sn) => (sn.id === editingSocialNetwork.id ? updated : sn))
    );
  };

  const handleDelete = async (socialNetworkId: number) => {
    if (!confirm(t('socialNetworks.deleteConfirm'))) return;

    try {
      await socialNetworksService.deleteSocialNetwork(profileId, socialNetworkId);
      setSocialNetworks((prev) => prev.filter((sn) => sn.id !== socialNetworkId));
      dispatch(updateProfileCompletion(profileId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('socialNetworks.errors.deleteFailed');
      setError(errorMessage);
    }
  };

  const handleToggleVisibility = async (socialNetwork: SocialNetwork) => {
    try {
      const updated = await socialNetworksService.updateSocialNetwork(profileId, socialNetwork.id, {
        is_visible: !socialNetwork.is_visible,
      });
      setSocialNetworks((prev) =>
        prev.map((sn) => (sn.id === socialNetwork.id ? updated : sn))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('socialNetworks.errors.updateFailed');
      setError(errorMessage);
    }
  };

  const handleOpenForm = (socialNetwork?: SocialNetwork) => {
    setEditingSocialNetwork(socialNetwork || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSocialNetwork(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(`/profiles/${id}/edit`)}
          sx={{ mb: 2 }}
        >
          {t('common.back')}
        </Button>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1">
            {t('socialNetworks.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            disabled={loading}
          >
            {t('socialNetworks.addButton')}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('socialNetworks.description')}
        </Typography>
      </Box>

      {currentProfile && (
        <ProfileCompletionCard
          completionPercentage={currentProfile.completion_percentage || 0}
        />
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {socialNetworks.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {t('socialNetworks.empty')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              sx={{ mt: 2 }}
            >
              {t('socialNetworks.addFirst')}
            </Button>
          </Box>
        ) : (
          <List>
            {socialNetworks.map((socialNetwork, index) => (
              <ListItem
                key={socialNetwork.id}
                divider={index < socialNetworks.length - 1}
                sx={{
                  opacity: socialNetwork.is_visible ? 1 : 0.6,
                  '&:hover': { backgroundColor: 'action.hover' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: { xs: 2, sm: 0 },
                  py: { xs: 2, sm: 1 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1, gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', pt: 0.5 }}>
                    {PLATFORM_ICONS[socialNetwork.platform]}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="subtitle1">
                        {t(`socialNetworks.platforms.${socialNetwork.platform}`)}
                      </Typography>
                      {socialNetwork.username && (
                        <Chip
                          label={socialNetwork.username}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <MuiLink
                      href={socialNetwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        wordBreak: 'break-all',
                        display: 'block',
                        mt: 0.5,
                        fontSize: '0.875rem',
                      }}
                    >
                      {socialNetwork.url}
                    </MuiLink>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                  }}
                >
                  <IconButton
                    onClick={() => handleToggleVisibility(socialNetwork)}
                    size="small"
                    title={
                      socialNetwork.is_visible
                        ? t('common.hide')
                        : t('common.show')
                    }
                  >
                    {socialNetwork.is_visible ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenForm(socialNetwork)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(socialNetwork.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <SocialNetworksForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingSocialNetwork ? handleUpdate : handleCreate}
        initialData={editingSocialNetwork || undefined}
        mode={editingSocialNetwork ? 'edit' : 'create'}
      />
    </Container>
  );
}
