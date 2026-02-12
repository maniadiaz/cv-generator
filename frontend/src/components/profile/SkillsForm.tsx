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
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  LinearProgress,
  Tabs,
  Tab,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
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
import type { Skill } from '@app-types/index';
import { skillsService } from '@api/skillsService';
import type { CreateSkillData, SkillCategory } from '@api/skillsService';

// Claves de traducción para las opciones de habilidades de idiomas
const LANGUAGE_SKILL_KEYS = [
  'translation',
  'interpretation',
  'technicalWriting'
];

const schema = yup.object().shape({
  name: yup.string().required('skills.nameRequired'),
  category: yup.string().required('skills.categoryRequired'),
  proficiency_level: yup.string().required('skills.levelRequired'),
  years_of_experience: yup.number().min(0).max(50).optional(),
});

// Helper functions to convert between rating number (1-5) and proficiency_level string
const numberToLevel = (num: number): string => {
  if (num <= 1) return 'beginner';
  if (num <= 2) return 'intermediate';
  if (num <= 3) return 'advanced';
  if (num <= 4) return 'expert';
  return 'master';
};

const levelToNumber = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'beginner': return 1;
    case 'intermediate': return 2;
    case 'advanced': return 3;
    case 'expert': return 4;
    case 'master': return 5;
    default: return 3;
  }
};

interface SkillsFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

const SkillsForm = ({ profileId, onSaveSuccess }: SkillsFormProps) => {
  const { t } = useTranslation();
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateSkillData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      category: 'frameworks_libraries',
      proficiency_level: 'advanced',
      years_of_experience: 0,
    },
  });

  useEffect(() => {
    loadSkills();
    loadCategories();
  }, [profileId]);

  // Limpiar el campo "name" cuando cambia la categoría
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'category') {
        setValue('name', '');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skillsService.getSkills(profileId);
      if (data && Array.isArray(data)) {
        setSkillsList(data);
      } else {
        setSkillsList([]);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || t('common.error'));
      }
      setSkillsList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    // Categorías predefinidas como fallback (las 7 originales)
    const fallbackCategories: SkillCategory[] = [
      { value: 'programming_languages', label: 'Lenguajes de Programación', description: '', icon: 'code', examples: [] },
      { value: 'frameworks_libraries', label: 'Frameworks y Librerías', description: '', icon: 'library', examples: [] },
      { value: 'databases', label: 'Bases de Datos', description: '', icon: 'database', examples: [] },
      { value: 'cloud_devops', label: 'Cloud y DevOps', description: '', icon: 'cloud', examples: [] },
      { value: 'tools', label: 'Herramientas', description: '', icon: 'tool', examples: [] },
      { value: 'soft_skills', label: 'Habilidades Blandas', description: '', icon: 'people', examples: [] },
      { value: 'other', label: 'Otros', description: '', icon: 'more', examples: [] }
    ];

    try {
      setLoadingCategories(true);
      const data = await skillsService.getCategoriesDetailed(profileId);
      setCategories(data && data.length > 0 ? data : fallbackCategories);
    } catch (err: any) {
      // Si el endpoint no existe o falla, usar categorías predefinidas como fallback
      console.warn('⚠️ Failed to load categories from API, using fallback (7 categories):', err?.response?.data || err?.message);
      console.info('💡 Backend needs to implement the endpoint: GET /api/profiles/:profileId/skills/categories');
      console.info('📝 Expected response format:', {
        success: true,
        data: {
          categories: [{ value: 'string', label: 'string', description: 'string', icon: 'string', examples: ['string'] }],
          total: 33
        }
      });
      setCategories(fallbackCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    reset({
      name: '',
      category: 'frameworks_libraries',
      proficiency_level: 'advanced',
      years_of_experience: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    reset({
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.proficiency_level,
      years_of_experience: skill.years_of_experience || 0,
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
      await skillsService.deleteSkill(profileId, deletingId);
      await loadSkills();
      await loadCategories();
      onSaveSuccess?.();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || t('skills.deleteError'));
    }
  };

  const onSubmit = async (data: CreateSkillData) => {

    try {
      setError(null);
      if (editingId) {
        await skillsService.updateSkill(profileId, editingId, data);
      } else {
        await skillsService.createSkill(profileId, data);
      }
      await loadSkills();
      await loadCategories();
      onSaveSuccess?.();
      setDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error('Error saving skill:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || t('skills.saveError'));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredSkills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSkillsList((prev) => {
      const allSkills = [...prev];
      const filteredIds = items.map((item) => item.id);
      const orderedSkills = allSkills.sort((a, b) => {
        const indexA = filteredIds.indexOf(a.id);
        const indexB = filteredIds.indexOf(b.id);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      return orderedSkills;
    });

    try {
      const orderedIds = items.map((item) => item.id);
      await skillsService.reorderSkills(profileId, orderedIds);
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('skills.reorderError'));
      await loadSkills();
    }
  };

  const getLevelColor = (level: string) => {
    const num = levelToNumber(level);
    if (num <= 1) return 'error';
    if (num <= 2) return 'warning';
    if (num <= 3) return 'info';
    if (num <= 4) return 'primary';
    return 'success';
  };

  const getLevelLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return t('skills.levelBeginner');
      case 'intermediate': return t('skills.levelIntermediate');
      case 'advanced': return t('skills.levelAdvanced');
      case 'expert': return t('skills.levelExpert');
      case 'master': return t('skills.levelMaster');
      default: return level;
    }
  };

  const filteredSkills =
    selectedCategory === 'all'
      ? skillsList
      : skillsList.filter((skill) => skill.category === selectedCategory);

  const uniqueCategories = Array.from(
    new Set(skillsList.map((skill) => skill.category))
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      overflow: 'hidden',
      maxWidth: { xs: 330, sm: '100%' },
      mx: 'auto'
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header with Add Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {skillsList?.length || 0} {skillsList?.length === 1 ? t('skills.skill') : t('skills.skills')}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAdd}
          size="small"
          sx={{
            minWidth: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          {t('skills.addSkill')}
        </Button>
      </Box>

      {/* Category Tabs */}
      {uniqueCategories.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, width: '100%', overflow: 'hidden' }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile={isMobile}
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', sm: 90 },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.813rem', sm: '0.875rem' },
              },
              '& .MuiTabs-scrollButtons': {
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab label={t('skills.allCategories')} value="all" />
            {uniqueCategories.map((category) => {
              const categoryDetails = categories.find(cat => cat.value === category);
              return (
                <Tab
                  key={category}
                  label={categoryDetails?.label || t(`skills.categories.${category}`)}
                  value={category}
                />
              );
            })}
          </Tabs>
        </Box>
      )}

      {/* Skills List */}
      {!skillsList || skillsList.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              {t('skills.emptyState')}
            </Typography>
          </CardContent>
        </Card>
      ) : filteredSkills.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              {t('skills.noCategorySkills')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {filteredSkills.map((skill, index) => (
                  <Draggable key={skill.id} draggableId={skill.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          mb: 2,
                          bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                          overflow: 'hidden',
                          maxWidth: "100%",
                          mx: 'auto',
                        }}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: { xs: 1, sm: 2 },
                              width: '100%',
                            }}
                          >
                            {/* Drag Handle - Hidden on mobile */}
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                cursor: 'grab',
                                color: 'text.secondary',
                                flexShrink: 0,
                                '&:active': { cursor: 'grabbing' },
                              }}
                            >
                              <DragIcon />
                            </Box>

                            {/* Skill Info */}
                            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                              <Stack spacing={1}>
                                {/* Name and Category */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontSize: { xs: '1rem', sm: '1.25rem' },
                                      wordBreak: 'break-word',
                                      flex: { xs: '1 1 100%', sm: '0 1 auto' },
                                    }}
                                  >
                                    {skill.name}
                                  </Typography>
                                  <Chip
                                    label={
                                      categories.find(cat => cat.value === skill.category)?.label ||
                                      t(`skills.categories.${skill.category}`)
                                    }
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                      fontSize: { xs: '0.688rem', sm: '0.75rem' },
                                      height: { xs: 20, sm: 24 },
                                    }}
                                  />
                                </Box>

                                {/* Rating and Progress */}
                                <Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: { xs: 1, sm: 2 },
                                      mb: 0.5,
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <Rating
                                      value={levelToNumber(skill.proficiency_level)}
                                      max={5}
                                      readOnly
                                      size="small"
                                      sx={{
                                        fontSize: { xs: '1rem', sm: '1.25rem' },
                                      }}
                                    />
                                    <Chip
                                      label={getLevelLabel(skill.proficiency_level)}
                                      size="small"
                                      color={getLevelColor(skill.proficiency_level)}
                                      sx={{
                                        fontSize: { xs: '0.688rem', sm: '0.75rem' },
                                        height: { xs: 20, sm: 24 },
                                      }}
                                    />
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(levelToNumber(skill.proficiency_level) / 5) * 100}
                                    color={getLevelColor(skill.proficiency_level)}
                                    sx={{
                                      height: { xs: 4, sm: 6 },
                                      borderRadius: 3,
                                      width: '100%',
                                    }}
                                  />
                                </Box>

                                {/* Years of Experience */}
                                {skill.years_of_experience !== undefined &&
                                  skill.years_of_experience > 0 && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                      {skill.years_of_experience}{' '}
                                      {skill.years_of_experience === 1
                                        ? t('skills.year')
                                        : t('skills.years')}{' '}
                                      {t('skills.experience')}
                                    </Typography>
                                  )}
                              </Stack>
                            </Box>

                            {/* Actions */}
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexShrink: 0 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(skill)}
                                sx={{ p: { xs: 0.5, sm: 1 } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(skill.id)}
                                sx={{ p: { xs: 0.5, sm: 1 } }}
                              >
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
            maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ pb: 1 }}>
            {editingId ? t('skills.editSkill') : t('skills.addSkill')}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ mt: { xs: 1, sm: 2 } }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => {
                      const selectedCategory = watch('category');

                      // Si la categoría es "languages", mostrar Select con opciones predefinidas
                      if (selectedCategory === 'languages') {
                        return (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label={t('skills.name')}
                            error={!!errors.name}
                            helperText={
                              errors.name
                                ? t(errors.name.message as string)
                                : t('skills.languageSkillHelper')
                            }
                            size="small"
                          >
                            {LANGUAGE_SKILL_KEYS.map((key) => (
                              <MenuItem key={key} value={t(`skills.languageSkills.${key}`)}>
                                {t(`skills.languageSkills.${key}`)}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      }

                      // Para otras categorías, mostrar campo de texto normal
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label={t('skills.name')}
                          error={!!errors.name}
                          helperText={errors.name ? t(errors.name.message as string) : ''}
                          size="small"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        select
                        label={t('skills.category')}
                        error={!!errors.category}
                        disabled={loadingCategories}
                        helperText={
                          loadingCategories
                            ? 'Cargando categorías...'
                            : errors.category
                            ? t(errors.category.message as string)
                            : t('skills.categoryHelper')
                        }
                        size="small"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {t('skills.level')}
                  </Typography>
                  <Controller
                    name="proficiency_level"
                    control={control}
                    render={({ field }) => (
                      <Stack spacing={1}>
                        <Rating
                          value={levelToNumber(field.value)}
                          max={5}
                          size="large"
                          onChange={(_, value) => field.onChange(numberToLevel(value || 1))}
                          sx={{
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                          }}
                        />
                        {field.value && (
                          <Chip
                            label={getLevelLabel(field.value)}
                            color={getLevelColor(field.value)}
                            size="small"
                          />
                        )}
                      </Stack>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="years_of_experience"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label={t('skills.yearsExperience')}
                        inputProps={{ min: 0, max: 50 }}
                        error={!!errors.years_of_experience}
                        helperText={
                          errors.years_of_experience
                            ? t(errors.years_of_experience.message as string)
                            : t('skills.yearsExperienceHelper')
                        }
                        size="small"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
            <Button onClick={() => setDialogOpen(false)} size="small">
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              size="small"
            >
              {isSubmitting ? <CircularProgress size={20} /> : t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
          },
        }}
      >
        <DialogTitle>{t('skills.deleteSkill')}</DialogTitle>
        <DialogContent>
          <Typography>{t('skills.deleteConfirm')}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
          <Button onClick={() => setDeleteDialogOpen(false)} size="small">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" size="small">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsForm;