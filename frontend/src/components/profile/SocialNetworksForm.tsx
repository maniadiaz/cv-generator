import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { SocialNetwork, SocialPlatform } from '@app-types/index';
import { useTranslation } from 'react-i18next';

interface SocialNetworksFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SocialNetwork, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: SocialNetwork;
  mode: 'create' | 'edit';
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'linkedin',
  'github',
  'gitlab',
  'twitter',
  'portfolio',
  'stackoverflow',
  'medium',
  'youtube',
  'behance',
  'dribbble',
  'other',
];

const PLATFORM_URL_PATTERNS: Record<SocialPlatform, string> = {
  linkedin: 'https://linkedin.com/in/',
  github: 'https://github.com/',
  gitlab: 'https://gitlab.com/',
  twitter: 'https://twitter.com/',
  portfolio: 'https://',
  stackoverflow: 'https://stackoverflow.com/users/',
  medium: 'https://medium.com/@',
  youtube: 'https://youtube.com/@',
  behance: 'https://behance.net/',
  dribbble: 'https://dribbble.com/',
  other: 'https://',
};

export default function SocialNetworksForm({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: SocialNetworksFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<SocialNetwork, 'id' | 'created_at' | 'updated_at'>>({
    platform: initialData?.platform || 'linkedin',
    url: initialData?.url || '',
    username: initialData?.username || '',
    is_visible: initialData?.is_visible ?? true,
    display_order: initialData?.display_order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handlePlatformChange = (platform: SocialPlatform) => {
    setFormData((prev) => ({
      ...prev,
      platform,
      url: PLATFORM_URL_PATTERNS[platform],
    }));
    setUrlError(null);
  };

  const handleUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, url }));

    if (url && !validateUrl(url)) {
      setUrlError(t('socialNetworks.errors.invalidUrl'));
    } else {
      setUrlError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setError(t('socialNetworks.errors.urlRequired'));
      return;
    }

    if (!validateUrl(formData.url)) {
      setUrlError(t('socialNetworks.errors.invalidUrl'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('socialNetworks.errors.saveFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        platform: 'linkedin',
        url: '',
        username: '',
        is_visible: true,
        display_order: 0,
      });
      setError(null);
      setUrlError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {mode === 'create' ? t('socialNetworks.addTitle') : t('socialNetworks.editTitle')}
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            select
            fullWidth
            label={t('socialNetworks.platform')}
            value={formData.platform}
            onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
            margin="normal"
            required
            disabled={loading}
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {t(`socialNetworks.platforms.${platform}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label={t('socialNetworks.url')}
            value={formData.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            error={!!urlError}
            helperText={urlError || t('socialNetworks.urlHelp')}
            placeholder="https://example.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔗</InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('socialNetworks.username')}
            value={formData.username}
            onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
            margin="normal"
            disabled={loading}
            helperText={t('socialNetworks.usernameHelp')}
            placeholder="@username"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !!urlError}
          >
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
