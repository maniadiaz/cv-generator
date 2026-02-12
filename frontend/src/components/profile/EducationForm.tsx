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
import { educationService, type CreateEducationData } from '@api/educationService';
import type { Education } from '@app-types/index';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface EducationFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

const schema: yup.ObjectSchema<CreateEducationData> = yup.object({
  institution: yup.string().required('education.institutionRequired'),
  degree: yup.string().required('education.degreeRequired'),
  field_of_study: yup.string().required('education.fieldRequired'),
  start_date: yup.string().required('education.startDateRequired'),
  end_date: yup.string().when('is_current', {
    is: false,
    then: (schema) => schema.required('education.endDateRequired'),
    otherwise: (schema) => schema.optional(),
  }),
  is_current: yup.boolean().required(),
  gpa: yup.string().optional(),
  description: yup.string().optional(),
});

const EducationForm = ({ profileId, onSaveSuccess }: EducationFormProps) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'es' ? es : enUS;
  const [educationList, setEducationList] = useState<Education[]>([]);
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
  } = useForm<CreateEducationData>({
    resolver: yupResolver(schema),
    defaultValues: {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      gpa: '',
      description: '',
    },
  });

  const isCurrent = watch('is_current');

  useEffect(() => {
    loadEducation();
  }, [profileId]);

  const loadEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationService.getEducation(profileId);
      if (data && Array.isArray(data)) {
        setEducationList(data);
      } else {
        setEducationList([]);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || t('common.error'));
      }
      setEducationList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    reset({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      gpa: '',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    reset({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study,
      start_date: education.start_date,
      end_date: education.end_date || '',
      is_current: education.is_current,
      gpa: education.gpa || '',
      description: education.description || '',
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
        await educationService.deleteEducation(profileId, deleteId);
        await loadEducation();
        onSaveSuccess?.();
        setDeleteDialogOpen(false);
        setDeleteId(null);
      } catch (err: any) {
        setError(err.response?.data?.message || t('education.deleteError'));
      }
    }
  };

  const onSubmit = async (data: CreateEducationData) => {
    try {
      setError(null);
      if (editingId) {
        await educationService.updateEducation(profileId, editingId, data);
      } else {
        await educationService.createEducation(profileId, data);
      }
      await loadEducation();
      onSaveSuccess?.();
      setDialogOpen(false);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || t('education.saveError'));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(educationList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEducationList(items);

    try {
      const orderedIds = items.map((item) => item.id);
      await educationService.reorderEducation(profileId, orderedIds);
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('education.saveError'));
      await loadEducation();
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
          {educationList?.length || 0} {educationList?.length === 1 ? t('education.entry') : t('education.entries')}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={handleAdd}
          size="small"
        >
          {t('education.addEducation')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!educationList || educationList.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('education.noEntries')}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ mt: 2 }}
            >
              {t('education.addEducation')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="education-list">
            {(provided) => (
              <Grid
                container
                spacing={2}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {educationList.map((education, index) => (
                  <Draggable
                    key={education.id}
                    draggableId={education.id.toString()}
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
                                  {education.degree}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                  {education.institution}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {education.field_of_study}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <Chip
                                    label={`${format(new Date(education.start_date), 'MMM yyyy', { locale: dateLocale })} - ${
                                      education.is_current
                                        ? t('education.present')
                                        : format(new Date(education.end_date!), 'MMM yyyy', { locale: dateLocale })
                                    }`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  {education.gpa && (
                                    <Chip
                                      label={`GPA: ${education.gpa}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  {education.is_current && (
                                    <Chip
                                      label={t('education.current')}
                                      size="small"
                                      color="primary"
                                    />
                                  )}
                                </Box>
                                {education.description && (
                                  <Typography variant="body2" sx={{ mt: 2 }}>
                                    {education.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(education)}
                              title={t('common.edit')}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(education.id)}
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
            {editingId ? t('education.editEducation') : t('education.addEducation')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="institution"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('education.institution')}
                      error={!!errors.institution}
                      helperText={errors.institution ? t(errors.institution.message as string) : ''}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="degree"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('education.degree')}
                      error={!!errors.degree}
                      helperText={errors.degree ? t(errors.degree.message as string) : ''}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="field_of_study"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('education.field')}
                      error={!!errors.field_of_study}
                      helperText={errors.field_of_study ? t(errors.field_of_study.message as string) : ''}
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
                      label={t('education.startDate')}
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
                      label={t('education.endDate')}
                      InputLabelProps={{ shrink: true }}
                      disabled={isCurrent}
                      error={!!errors.end_date}
                      helperText={errors.end_date ? t(errors.end_date.message as string) : ''}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="is_current"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label={t('education.current')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="gpa"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('education.gpa')}
                      placeholder="9.5"
                      error={!!errors.gpa}
                      helperText={errors.gpa ? t(errors.gpa.message as string) : t('education.gpaOptional')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label={t('education.description')}
                      placeholder={t('education.descriptionPlaceholder')}
                      error={!!errors.description}
                      helperText={errors.description ? t(errors.description.message as string) : ''}
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
        <DialogTitle>{t('education.deleteEducation')}</DialogTitle>
        <DialogContent>
          <Typography>{t('education.deleteConfirm')}</Typography>
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

export default EducationForm;
