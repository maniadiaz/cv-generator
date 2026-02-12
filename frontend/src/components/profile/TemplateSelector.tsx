import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { templatesService } from '@api/templatesService';
import type { Template, TemplateName } from '@app-types/index';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-cv.servercontrol-mzt.com';

interface TemplateSelectorProps {
  profileId: number;
  currentTemplate: TemplateName;
  onTemplateChange: (templateName: TemplateName) => void;
}

export default function TemplateSelector({
  profileId,
  currentTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(currentTemplate);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    setSelectedTemplate(currentTemplate);
  }, [currentTemplate]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templatesService.getTemplates();
      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('templates.errors.loadFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedTemplate === currentTemplate) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await templatesService.changeTemplate(profileId, selectedTemplate);
      onTemplateChange(selectedTemplate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('templates.errors.changeFailed');
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleImageError = (templateName: string) => {
    setImageErrors(prev => new Set(prev).add(templateName));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && templates.length === 0) {
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
          {t('templates.changeSuccess')}
        </Alert>
      )}

      <RadioGroup
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value as TemplateName)}
      >
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid size={{ xs: 12, md: 6 }} key={template.name}>
              <Card
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selectedTemplate === template.name ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => setSelectedTemplate(template.name)}
              >
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

                {imageErrors.has(template.name) ? (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2" align="center">
                      {t('templates.previewNotAvailable') || 'Vista previa no disponible'}
                    </Typography>
                  </Box>
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.previewImage.startsWith('http')
                      ? template.previewImage
                      : `${API_BASE_URL}${template.previewImage}`}
                    alt={template.displayName}
                    sx={{ objectFit: 'cover' }}
                    onError={() => handleImageError(template.name)}
                  />
                )}

                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <FormControlLabel
                      value={template.name}
                      control={<Radio />}
                      label={
                        <Typography variant="h6" component="span">
                          {template.displayName}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                    <Chip label={template.category} size="small" color="primary" variant="outlined" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2}>
                    {Object.entries(template.colors).map(([key, color]) => (
                      <Box
                        key={key}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: color,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                        title={`${key}: ${color}`}
                      />
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {t('templates.features')}:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {template.features.map((feature, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="caption"
                        color="text.secondary"
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || selectedTemplate === currentTemplate}
        >
          {saving ? t('common.saving') : t('templates.applyTemplate')}
        </Button>
      </Box>
    </Box>
  );
}
