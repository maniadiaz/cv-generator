import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Check as CheckIcon, Palette as PaletteIcon } from '@mui/icons-material';
import { colorSchemeService } from '@api/colorSchemeService';
import type { ColorScheme, ColorSchemeCategory } from '@app-types/index';
import { useTranslation } from 'react-i18next';

interface ColorSchemeSelectorProps {
  profileId: number;
  currentScheme: string;
  onSchemeChange: (schemeId: string) => Promise<void>;
}

export default function ColorSchemeSelector({
  currentScheme,
  onSchemeChange,
}: ColorSchemeSelectorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [schemes, setSchemes] = useState<ColorScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<string>(currentScheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ColorSchemeCategory | 'all'>('all');

  useEffect(() => {
    loadColorSchemes();
  }, []);

  useEffect(() => {
    setSelectedScheme(currentScheme);
  }, [currentScheme]);

  const loadColorSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await colorSchemeService.getColorSchemes();
      setSchemes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('colorSchemes.errors.loadFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedScheme === currentScheme) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await onSchemeChange(selectedScheme);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('colorSchemes.errors.changeFailed');
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(scheme => scheme.category === selectedCategory);

  const categories: Array<{ value: ColorSchemeCategory | 'all'; label: string }> = [
    { value: 'all', label: t('colorSchemes.categories.all') },
    { value: 'classic', label: t('colorSchemes.categories.classic') },
    { value: 'corporate', label: t('colorSchemes.categories.corporate') },
    { value: 'modern', label: t('colorSchemes.categories.modern') },
    { value: 'creative', label: t('colorSchemes.categories.creative') },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && schemes.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          {t('colorSchemes.changeSuccess')}
        </Alert>
      )}

      {/* Category Tabs - Scrollable on mobile */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              label={category.label}
              value={category.value}
            />
          ))}
        </Tabs>
      </Box>

      <RadioGroup
        value={selectedScheme}
        onChange={(e) => setSelectedScheme(e.target.value)}
      >
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {filteredSchemes.map((scheme) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={scheme.id}>
              <Card
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selectedScheme === scheme.id ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: isMobile ? 'none' : 'translateY(-2px)',
                  },
                  height: '100%',
                }}
                onClick={() => setSelectedScheme(scheme.id)}
              >
                {selectedScheme === scheme.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </Box>
                )}

                <CardContent sx={{ pb: isMobile ? 2 : 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <FormControlLabel
                      value={scheme.id}
                      control={<Radio />}
                      label={
                        <Typography
                          variant={isMobile ? 'subtitle1' : 'h6'}
                          component="span"
                          sx={{ fontWeight: 600 }}
                        >
                          {scheme.name}
                        </Typography>
                      }
                      sx={{ m: 0, flexGrow: 1 }}
                    />
                    <Chip
                      label={t(`colorSchemes.categories.${scheme.category}`)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        display: isMobile ? 'none' : 'flex',
                      }}
                    />
                  </Box>

                  {/* Show category badge on mobile */}
                  {isMobile && (
                    <Chip
                      label={t(`colorSchemes.categories.${scheme.category}`)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: isMobile ? 'auto' : 40,
                      fontSize: isMobile ? '0.875rem' : '0.875rem',
                    }}
                  >
                    {scheme.description}
                  </Typography>

                  {/* Color Preview */}
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 1,
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                      }}
                    >
                      <PaletteIcon fontSize="small" />
                      {t('colorSchemes.colorPreview')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Box
                        sx={{
                          width: isMobile ? 36 : 40,
                          height: isMobile ? 36 : 40,
                          borderRadius: 1,
                          backgroundColor: scheme.colors.primary,
                          border: '1px solid',
                          borderColor: 'divider',
                          flexShrink: 0,
                        }}
                        title={`Primary: ${scheme.colors.primary}`}
                      />
                      <Box
                        sx={{
                          width: isMobile ? 36 : 40,
                          height: isMobile ? 36 : 40,
                          borderRadius: 1,
                          backgroundColor: scheme.colors.accent,
                          border: '1px solid',
                          borderColor: 'divider',
                          flexShrink: 0,
                        }}
                        title={`Accent: ${scheme.colors.accent}`}
                      />
                      <Box
                        sx={{
                          width: isMobile ? 36 : 40,
                          height: isMobile ? 36 : 40,
                          borderRadius: 1,
                          backgroundColor: scheme.colors.headerBg,
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: scheme.colors.headerText,
                          fontSize: isMobile ? '0.65rem' : '0.7rem',
                          fontWeight: 'bold',
                          flexShrink: 0,
                        }}
                        title={`Header: ${scheme.colors.headerBg}`}
                      >
                        Aa
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {filteredSchemes.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            {t('colorSchemes.noSchemesFound')}
          </Typography>
        </Box>
      )}

      {/* Apply Button - Fixed on mobile, inline on desktop */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
          position: isMobile ? 'sticky' : 'relative',
          bottom: isMobile ? 16 : 'auto',
          zIndex: isMobile ? 10 : 'auto',
          backgroundColor: isMobile ? 'background.paper' : 'transparent',
          py: isMobile ? 2 : 0,
          px: isMobile ? 2 : 0,
          mx: isMobile ? -2 : 0,
          borderTop: isMobile ? 1 : 0,
          borderColor: isMobile ? 'divider' : 'transparent',
          boxShadow: isMobile ? '0 -2px 8px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || selectedScheme === currentScheme}
          fullWidth={isMobile}
          size={isMobile ? 'large' : 'medium'}
        >
          {saving ? t('common.saving') : t('colorSchemes.applyScheme')}
        </Button>
      </Box>
    </Box>
  );
}
