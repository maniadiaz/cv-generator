import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  CircularProgress,
  Alert,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { templatesService } from '@api/templatesService';
import { colorSchemeService } from '@api/colorSchemeService';
import { profileService } from '@api/profileService';
import type { Template, TemplateName } from '@api/templatesService';
import type { ColorScheme, ColorSchemeCategory } from '@app-types/index';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  profileId: number;
}

interface ExportConfig {
  templateName: TemplateName;
  templateDisplayName: string;
  colorSchemeId: string;
  colorSchemeName: string;
}

const ExportModal = ({ open, onClose, profileId }: ExportModalProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName | null>(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ColorSchemeCategory | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<ExportConfig[]>([]);

  const steps = [
    t('templates.selectTemplate'),
    t('colorSchemes.selectScheme'),
    t('pdf.preview'),
  ];

  useEffect(() => {
    if (open) {
      loadTemplates();
      loadSavedConfigs();
    }
  }, [open, profileId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const [templatesData, colorSchemesData] = await Promise.all([
        templatesService.getTemplates(),
        colorSchemeService.getColorSchemes(),
      ]);
      setTemplates(templatesData);
      setColorSchemes(colorSchemesData);
    } catch (err) {
      setError(t('templates.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (previewImage: string) => {
    const baseURL = import.meta.env.VITE_API_URL || 'https://api-cv.servercontrol-mzt.com';
    if (previewImage.startsWith('http')) {
      return previewImage;
    }
    return `${baseURL}${previewImage}`;
  };

  const loadSavedConfigs = () => {
    const saved = localStorage.getItem(`export_configs_${profileId}`);
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  };

  const saveConfig = () => {
    if (!selectedTemplate || !selectedColorScheme) return;

    const template = templates.find((t) => t.name === selectedTemplate);
    const colorScheme = colorSchemes.find((c) => c.id === selectedColorScheme);
    if (!template || !colorScheme) return;

    const newConfig: ExportConfig = {
      templateName: selectedTemplate,
      templateDisplayName: template.displayName,
      colorSchemeId: selectedColorScheme,
      colorSchemeName: colorScheme.name,
    };

    const configExists = savedConfigs.some(
      c => c.templateName === selectedTemplate && c.colorSchemeId === selectedColorScheme
    );
    if (configExists) return;

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem(`export_configs_${profileId}`, JSON.stringify(updatedConfigs));
  };

  const handleNext = async () => {
    if (activeStep === 0 && !selectedTemplate) {
      setError(t('templates.errors.changeFailed'));
      return;
    }
    if (activeStep === 1 && !selectedColorScheme) {
      setError(t('colorSchemes.errors.changeFailed'));
      return;
    }

    if (activeStep === 1) {
      await generatePreview();
    }

    setActiveStep((prev) => prev + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedTemplate(null);
    setSelectedColorScheme(null);
    setSelectedCategory('all');
    setError(null);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const generatePreview = async () => {
    if (!selectedTemplate || !selectedColorScheme) return;

    try {
      setLoading(true);
      setError(null);

      await templatesService.changeTemplate(profileId, selectedTemplate);
      await profileService.updateProfile(profileId, { color_scheme: selectedColorScheme });
      const blob = await templatesService.previewPDF(profileId);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('pdf.errors.previewFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedTemplate || !selectedColorScheme) return;

    try {
      setLoading(true);
      setError(null);

      const blob = await templatesService.exportPDF(profileId);
      const url = window.URL.createObjectURL(blob);
      const filename = `CV-${Date.now()}.pdf`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      saveConfig();

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('pdf.errors.exportFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUseSavedConfig = async (config: ExportConfig) => {
    setSelectedTemplate(config.templateName);
    setSelectedColorScheme(config.colorSchemeId);
    setActiveStep(2);
    
    try {
      setLoading(true);
      await templatesService.changeTemplate(profileId, config.templateName);
      await profileService.updateProfile(profileId, { color_scheme: config.colorSchemeId });
      const blob = await templatesService.previewPDF(profileId);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setError(t('pdf.errors.previewFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = selectedCategory === 'all'
    ? colorSchemes
    : colorSchemes.filter(scheme => scheme.category === selectedCategory);

  const categories: Array<{ value: ColorSchemeCategory | 'all'; label: string }> = [
    { value: 'all', label: t('colorSchemes.categories.all') },
    { value: 'classic', label: t('colorSchemes.categories.classic') },
    { value: 'corporate', label: t('colorSchemes.categories.corporate') },
    { value: 'modern', label: t('colorSchemes.categories.modern') },
    { value: 'creative', label: t('colorSchemes.categories.creative') },
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('templates.selectTemplate')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecciona la plantilla que deseas usar para tu CV
            </Typography>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid key={template.name} size={{ xs: 12, sm: 6 }}>
                  <Card
                    elevation={selectedTemplate === template.name ? 8 : 0}
                    sx={{
                      border: (theme) =>
                        selectedTemplate === template.name
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedTemplate(template.name)}>
                      {selectedTemplate === template.name && (
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
                      <Box
                        component="img"
                        src={getImageUrl(template.previewImage)}
                        alt={template.displayName}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          bgcolor: 'grey.100',
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {template.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {template.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('colorSchemes.selectScheme')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('colorSchemes.description')}
            </Typography>

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
              value={selectedColorScheme || ''}
              onChange={(e) => setSelectedColorScheme(e.target.value)}
            >
              <Grid container spacing={2}>
                {filteredSchemes.map((scheme) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={scheme.id}>
                    <Card
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedColorScheme === scheme.id ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-2px)',
                        },
                        height: '100%',
                      }}
                      onClick={() => setSelectedColorScheme(scheme.id)}
                    >
                      {selectedColorScheme === scheme.id && (
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

                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <FormControlLabel
                            value={scheme.id}
                            control={<Radio />}
                            label={
                              <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
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
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                          {scheme.description}
                        </Typography>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
                          >
                            <PaletteIcon fontSize="small" />
                            {t('colorSchemes.colorPreview')}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                backgroundColor: scheme.colors.primary,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                              title={`Primary: ${scheme.colors.primary}`}
                            />
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                backgroundColor: scheme.colors.accent,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                              title={`Accent: ${scheme.colors.accent}`}
                            />
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                backgroundColor: scheme.colors.headerBg,
                                border: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: scheme.colors.headerText,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
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
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('pdf.previewTitle')}
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
              </Box>
            ) : previewUrl ? (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ bgcolor: '#525659', borderRadius: 2, overflow: 'hidden', height: 600 }}>
                  <object
                    data={previewUrl}
                    type="application/pdf"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="PDF Preview"
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, color: 'white', px: 3 }}>
                      <Typography variant="h6">
                        {t('pdf.previewNote')}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        disabled={loading}
                      >
                        {t('pdf.download')}
                      </Button>
                    </Box>
                  </object>
                </Box>
              </Box>
            ) : null}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={700}>
              {t('pdf.export')}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {savedConfigs.length > 0 && activeStep === 0 && (
            <Fade in>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Configuraciones guardadas
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {savedConfigs.map((config, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <Card
                        elevation={0}
                        sx={{
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => handleUseSavedConfig(config)}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {config.templateDisplayName}
                          </Typography>
                          <Chip
                            label={config.colorSchemeName}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  O crea una nueva configuración:
                </Typography>
              </Box>
            </Fade>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {renderStepContent()}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep > 0 && (
            <Button onClick={handleBack} startIcon={<BackIcon />} disabled={loading}>
              {t('common.back')}
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NextIcon />}
              disabled={
                loading ||
                (activeStep === 0 && !selectedTemplate) ||
                (activeStep === 1 && !selectedColorScheme)
              }
            >
              {loading ? <CircularProgress size={24} /> : t('common.next')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('pdf.download')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportModal;
