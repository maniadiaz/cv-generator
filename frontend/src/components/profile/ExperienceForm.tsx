import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { experienceService, type CreateExperienceData } from '@api/experienceService';
import type { Experience } from '@app-types/index';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface ExperienceFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

const schema: yup.ObjectSchema<CreateExperienceData> = yup.object({
  project_title: yup.string().required('experience.projectTitleRequired'),
  position: yup.string().required('experience.positionRequired'),
  company: yup.string().required('experience.companyRequired'),
  start_date: yup.string().required('experience.startDateRequired'),
  end_date: yup.string().when('is_current', {
    is: false,
    then: (schema) => schema.required('experience.endDateRequired'),
    otherwise: (schema) => schema.optional(),
  }),
  is_current: yup.boolean().required(),
  achievements: yup.string().optional(),
  technologies: yup.string().optional(),
});

const ExperienceForm = ({ profileId, onSaveSuccess }: ExperienceFormProps) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'es' ? es : enUS;
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateExperienceData>({
    resolver: yupResolver(schema),
    defaultValues: {
      project_title: '',
      position: '',
      company: '',
      start_date: '',
      end_date: '',
      is_current: false,
      achievements: '',
      technologies: '',
    },
  });

  const isCurrent = watch('is_current');

  useEffect(() => {
    loadExperience();
  }, [profileId]);

  const loadExperience = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await experienceService.getExperience(profileId);
      if (data && Array.isArray(data)) {
        setExperienceList(data);
      } else {
        setExperienceList([]);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || t('common.error'));
      }
      setExperienceList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    reset({
      project_title: '',
      position: '',
      company: '',
      start_date: '',
      end_date: '',
      is_current: false,
      achievements: '',
      technologies: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    reset({
      project_title: experience.project_title,
      position: experience.position,
      company: experience.company,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      is_current: experience.is_current,
      achievements: experience.achievements || '',
      technologies: experience.technologies || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await experienceService.deleteExperience(profileId, deleteId);
        await loadExperience();
        onSaveSuccess?.();
        setDeleteDialogOpen(false);
        setDeleteId(null);
      } catch (err: any) {
        setError(err.response?.data?.message || t('experience.deleteError'));
      }
    }
  };

  const onSubmit = async (data: CreateExperienceData) => {
    try {
      setError(null);
      if (editingId) {
        await experienceService.updateExperience(profileId, editingId, data);
      } else {
        await experienceService.createExperience(profileId, data);
      }
      await loadExperience();
      onSaveSuccess?.();
      setDialogOpen(false);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || t('experience.saveError'));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(experienceList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExperienceList(items);

    try {
      const orderedIds = items.map((item) => item.id);
      await experienceService.reorderExperience(profileId, orderedIds);
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('experience.saveError'));
      await loadExperience();
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {experienceList?.length || 0} {experienceList?.length === 1 ? t('experience.entry') : t('experience.entries')}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={handleAdd}
          size="small"
        >
          {t('experience.addExperience')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!experienceList || experienceList.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('experience.noEntries')}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ mt: 2 }}
            >
              {t('experience.addExperience')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="experience-list">
            {(provided) => (
              <Grid
                container
                spacing={2}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {experienceList.map((experience, index) => (
                  <Draggable
                    key={experience.id}
                    draggableId={experience.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Grid size={{ xs: 12 }}>
                        <Card
                          variant="outlined"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  mr: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'grab',
                                  color: 'text.secondary',
                                  '&:active': { cursor: 'grabbing' }
                                }}
                              >
                                <DragIcon />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {experience.position}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                  {experience.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {experience.project_title}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <Chip
                                    label={`${format(new Date(experience.start_date), 'MMM yyyy', { locale: dateLocale })} - ${
                                      experience.is_current
                                        ? t('experience.present')
                                        : format(new Date(experience.end_date!), 'MMM yyyy', { locale: dateLocale })
                                    }`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  {experience.is_current && (
                                    <Chip
                                      label={t('experience.current')}
                                      size="small"
                                      color="primary"
                                    />
                                  )}
                                </Box>
                                {experience.technologies && (
                                  <Typography variant="body2" sx={{ mt: 2 }}>
                                    <strong>{t('experience.technologies')}:</strong> {experience.technologies}
                                  </Typography>
                                )}
                                {experience.achievements && (
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    {experience.achievements}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(experience)}
                              title={t('common.edit')}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(experience.id)}
                              title={t('common.delete')}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingId ? t('experience.editExperience') : t('experience.addExperience')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="project_title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('experience.projectTitle')}
                        error={!!errors.project_title}
                        helperText={errors.project_title ? t(errors.project_title.message as string) : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('experience.position')}
                        error={!!errors.position}
                        helperText={errors.position ? t(errors.position.message as string) : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('experience.company')}
                        error={!!errors.company}
                        helperText={errors.company ? t(errors.company.message as string) : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label={t('experience.startDate')}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.start_date}
                        helperText={errors.start_date ? t(errors.start_date.message as string) : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label={t('experience.endDate')}
                        InputLabelProps={{ shrink: true }}
                        disabled={isCurrent}
                        error={!!errors.end_date}
                        helperText={errors.end_date ? t(errors.end_date.message as string) : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="is_current"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label={t('experience.current')}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="technologies"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('experience.technologies')}
                        placeholder="Node.js, React, PostgreSQL"
                        error={!!errors.technologies}
                        helperText={errors.technologies ? t(errors.technologies.message as string) : t('experience.technologiesHelper')}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="achievements"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label={t('experience.achievements')}
                        placeholder={t('experience.achievementsPlaceholder')}
                        error={!!errors.achievements}
                        helperText={errors.achievements ? t(errors.achievements.message as string) : ''}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('experience.deleteExperience')}</DialogTitle>
        <DialogContent>
          <Typography>{t('experience.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExperienceForm;
