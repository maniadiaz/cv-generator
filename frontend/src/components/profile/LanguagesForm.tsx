import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import type { Language, LanguageLevel } from '@app-types/index';
import { languagesService } from '@api/languagesService';
import type { CreateLanguageData } from '@api/languagesService';

const schema = yup.object().shape({
  name: yup.string().required('languages.nameRequired'),
  proficiency_level: yup.string().required('languages.levelRequired'),
  certification_name: yup.string().optional(),
  certification_score: yup.string().optional(),
});

interface LanguagesFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

const LanguagesForm = ({ profileId, onSaveSuccess }: LanguagesFormProps) => {
  const { t } = useTranslation();
  const [languagesList, setLanguagesList] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLanguageData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      proficiency_level: 'intermediate',
      certification_name: '',
      certification_score: '',
    },
  });

  useEffect(() => {
    loadLanguages();
  }, [profileId]);

  const loadLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await languagesService.getLanguages(profileId);
      setLanguagesList(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t('languages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    reset({
      name: '',
      proficiency_level: 'intermediate',
      certification_name: '',
      certification_score: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (language: Language) => {
    setEditingId(language.id);
    reset({
      name: language.name,
      proficiency_level: language.proficiency_level,
      certification_name: language.certification_name || '',
      certification_score: language.certification_score || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await languagesService.deleteLanguage(profileId, deletingId);
      await loadLanguages();
      onSaveSuccess?.();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || t('languages.deleteError'));
    }
  };

  const onSubmit = async (data: CreateLanguageData) => {

    try {
      setError(null);
      if (editingId) {
        await languagesService.updateLanguage(profileId, editingId, data);
      } else {
        await languagesService.createLanguage(profileId, data);
      }
      await loadLanguages();
      onSaveSuccess?.();
      setDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error('Error saving language:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || t('languages.saveError'));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(languagesList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLanguagesList(items);

    try {
      const orderedIds = items.map((lang) => lang.id);
      await languagesService.reorderLanguages(profileId, orderedIds);
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('languages.reorderError'));
      await loadLanguages();
    }
  };

  const getLevelColor = (level: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (level.toLowerCase()) {
      case 'basic': return 'error';
      case 'intermediate': return 'info';
      case 'advanced': return 'primary';
      case 'fluent': return 'secondary';
      case 'native': return 'success';
      default: return 'default';
    }
  };

  const getLevelLabel = (level: string) => {
    const normalizedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    return t(`languages.level${normalizedLevel}`);
  };

  const languageLevels: LanguageLevel[] = ['basic', 'intermediate', 'advanced', 'fluent', 'native'];

  if (loading && languagesList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {languagesList.length} {languagesList.length === 1 ? t('languages.language') : t('languages.languages')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('languages.addLanguage')}
        </Button>
      </Box>

      {languagesList.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('languages.emptyState')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('languages.emptyStateDesc')}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              {t('languages.addLanguage')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="languages">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {languagesList.map((language, index) => (
                  <Draggable key={language.id} draggableId={String(language.id)} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          mb: 2,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box {...provided.dragHandleProps} sx={{ cursor: 'grab', mt: 1 }}>
                              <DragIcon color="action" />
                            </Box>

                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6">{language.name}</Typography>
                                <Chip
                                  label={getLevelLabel(language.proficiency_level)}
                                  color={getLevelColor(language.proficiency_level)}
                                  size="small"
                                />
                              </Box>

                              {language.certification_name && (
                                <Typography variant="body2" color="text.secondary">
                                  {t('languages.certification')}: {language.certification_name}
                                  {language.certification_score && ` - ${language.certification_score}`}
                                </Typography>
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleEdit(language)} color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteClick(language.id)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingId ? t('languages.editLanguage') : t('languages.addLanguage')}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('languages.name')}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name ? t(errors.name.message as string) : ''}
                      placeholder={t('languages.namePlaceholder')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="proficiency_level"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.proficiency_level}>
                      <InputLabel>{t('languages.level')}</InputLabel>
                      <Select {...field} label={t('languages.level')}>
                        {languageLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label={level} color={getLevelColor(level)} size="small" />
                              <Typography>{getLevelLabel(level)}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Certification */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('languages.certificationOptional')}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <Controller
                  name="certification_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('languages.certificationName')}
                      fullWidth
                      placeholder={t('languages.certificationNamePlaceholder')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="certification_score"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('languages.certificationScore')}
                      fullWidth
                      placeholder="110"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('languages.deleteLanguage')}</DialogTitle>
        <DialogContent>
          <Typography>{t('languages.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LanguagesForm;
