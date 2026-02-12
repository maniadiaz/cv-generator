import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Button,
  alpha,
  Fade,
  InputAdornment,
} from '@mui/material';
import { 
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { personalInfoService } from '@api/personalInfoService';

interface PersonalInfoFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

interface PersonalInfoFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  professional_title: string;
  summary: string;
}

const schema = yup.object({
  full_name: yup.string().required('common.nameRequired'),
  email: yup.string().email('auth.emailInvalid').required('auth.emailRequired'),
  phone: yup.string().default(''),
  location: yup.string().default(''),
  professional_title: yup.string().default(''),
  summary: yup.string().default(''),
});

const PersonalInfoForm = ({ profileId, onSaveSuccess }: PersonalInfoFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      professional_title: '',
      summary: '',
    },
  });

  // Watch all form fields to check if any has content
  const formValues = watch();
  const hasAnyContent = Object.values(formValues).some(value => value && value.trim() !== '');

  // Load personal info
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await personalInfoService.getPersonalInfo(profileId);
        reset({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          professional_title: data.professional_title || '',
          summary: data.summary || '',
        });
      } catch (err: any) {
        // If personal info doesn't exist yet (404), just show empty form
        if (err.response?.status === 404) {
          reset({
            full_name: '',
            email: '',
            phone: '',
            location: '',
            professional_title: '',
            summary: '',
          });
        } else {
          setErrorMessage(err.response?.data?.message || t('common.error'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, [profileId, reset, t]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      // Limpiar espacios en blanco pero mantener todos los campos (enviar string vacío si está vacío)
      const cleanedData: PersonalInfoFormData = {
        full_name: data.full_name?.trim() || '',
        email: data.email?.trim() || '',
        phone: data.phone?.trim() || '',
        location: data.location?.trim() || '',
        professional_title: data.professional_title?.trim() || '',
        summary: data.summary?.trim() || '',
      };
      
      await personalInfoService.updatePersonalInfo(profileId, cleanedData);
      setSuccessMessage(t('profile.saveSuccess'));
      onSaveSuccess?.();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Fade in={!!errorMessage} timeout={300}>
        <Box>
          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Fade>

      <Fade in={!!successMessage} timeout={300}>
        <Box>
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {successMessage}
            </Alert>
          )}
        </Box>
      </Fade>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.fullName')}
                error={!!errors.full_name}
                helperText={errors.full_name ? t(errors.full_name.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.email')}
                type="email"
                error={!!errors.email}
                helperText={errors.email ? t(errors.email.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.phone')}
                error={!!errors.phone}
                helperText={errors.phone ? t(errors.phone.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.location')}
                error={!!errors.location}
                helperText={errors.location ? t(errors.location.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="professional_title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.professionalTitle')}
                placeholder={t('personalInfo.professionalTitlePlaceholder')}
                error={!!errors.professional_title}
                helperText={errors.professional_title ? t(errors.professional_title.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label={t('personalInfo.summary')}
                placeholder={t('personalInfo.summaryPlaceholder')}
                error={!!errors.summary}
                helperText={errors.summary ? t(errors.summary.message as string) : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <DescriptionIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={saving || !hasAnyContent}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:disabled': {
                  transform: 'none',
                },
              }}
            >
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
