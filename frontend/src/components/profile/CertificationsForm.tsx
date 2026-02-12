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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import type { Certificate } from '@app-types/index';
import { certificationsService } from '@api/certificationsService';
import type { CreateCertificationData } from '@api/certificationsService';

const schema = yup.object().shape({
  name: yup.string().required('certificates.nameRequired'),
  issuing_organization: yup.string().required('certificates.issuerRequired'),
  issue_date: yup.string().required('certificates.issueDateRequired'),
  expiration_date: yup.string().optional(),
  credential_id: yup.string().optional(),
  credential_url: yup.string().url('certificates.urlInvalid').optional(),
});

interface CertificationsFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

const CertificationsForm = ({ profileId, onSaveSuccess }: CertificationsFormProps) => {
  const { t } = useTranslation();
  const [certificationsList, setCertificationsList] = useState<Certificate[]>([]);
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
  } = useForm<CreateCertificationData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: '',
    },
  });

  useEffect(() => {
    loadCertifications();
  }, [profileId]);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificationsService.getCertifications(profileId);
      setCertificationsList(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t('certificates.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    reset({
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (certification: Certificate) => {
    setEditingId(certification.id);
    reset({
      name: certification.name,
      issuing_organization: certification.issuing_organization,
      issue_date: certification.issue_date,
      expiration_date: certification.expiration_date || '',
      credential_id: certification.credential_id || '',
      credential_url: certification.credential_url || '',
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
      await certificationsService.deleteCertification(profileId, deletingId);
      await loadCertifications();
      onSaveSuccess?.();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || t('certificates.deleteError'));
    }
  };

  const onSubmit = async (data: CreateCertificationData) => {

    try {
      setError(null);
      if (editingId) {
        await certificationsService.updateCertification(profileId, editingId, data);
      } else {
        await certificationsService.createCertification(profileId, data);
      }
      await loadCertifications();
      onSaveSuccess?.();
      setDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error('Error saving certification:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || t('certificates.saveError'));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(certificationsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCertificationsList(items);

    try {
      const orderedIds = items.map((cert) => cert.id);
      await certificationsService.reorderCertifications(profileId, orderedIds);
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('certificates.reorderError'));
      await loadCertifications();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  if (loading && certificationsList.length === 0) {
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
          {certificationsList.length} {certificationsList.length === 1 ? t('certificates.certification') : t('certificates.certifications')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('certificates.addCertification')}
        </Button>
      </Box>

      {certificationsList.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('certificates.emptyState')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('certificates.emptyStateDesc')}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              {t('certificates.addCertification')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="certifications">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {certificationsList.map((certification, index) => (
                  <Draggable key={certification.id} draggableId={String(certification.id)} index={index}>
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
                                <Typography variant="h6">{certification.name}</Typography>
                                {certification.expiration_date && (
                                  <Chip
                                    label={isExpired(certification.expiration_date) ? t('certificates.expired') : t('certificates.valid')}
                                    color={isExpired(certification.expiration_date) ? 'error' : 'success'}
                                    size="small"
                                  />
                                )}
                              </Box>

                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {certification.issuing_organization}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <CalendarIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(certification.issue_date)}
                                  {certification.expiration_date && ` - ${formatDate(certification.expiration_date)}`}
                                </Typography>
                              </Box>

                              {certification.credential_id && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {t('certificates.credentialId')}: {certification.credential_id}
                                </Typography>
                              )}

                              {certification.credential_url && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <LinkIcon fontSize="small" color="action" />
                                  <a href={certification.credential_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem' }}>
                                    {t('certificates.viewCredential')}
                                  </a>
                                </Box>
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleEdit(certification)} color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteClick(certification.id)} color="error">
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
            {editingId ? t('certificates.editCertification') : t('certificates.addCertification')}
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
                      label={t('certificates.name')}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name ? t(errors.name.message as string) : ''}
                      placeholder={t('certificates.namePlaceholder')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="issuing_organization"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('certificates.issuer')}
                      fullWidth
                      error={!!errors.issuing_organization}
                      helperText={errors.issuing_organization ? t(errors.issuing_organization.message as string) : ''}
                      placeholder={t('certificates.issuerPlaceholder')}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="issue_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('certificates.issueDate')}
                      type="date"
                      fullWidth
                      error={!!errors.issue_date}
                      helperText={errors.issue_date ? t(errors.issue_date.message as string) : ''}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="expiration_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('certificates.expirationDate')}
                      type="date"
                      fullWidth
                      error={!!errors.expiration_date}
                      helperText={errors.expiration_date ? t(errors.expiration_date.message as string) : t('certificates.expirationHelper')}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="credential_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('certificates.credentialId')}
                      fullWidth
                      error={!!errors.credential_id}
                      helperText={errors.credential_id ? t(errors.credential_id.message as string) : t('certificates.credentialIdHelper')}
                      placeholder="ABC-123456"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="credential_url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('certificates.url')}
                      fullWidth
                      error={!!errors.credential_url}
                      helperText={errors.credential_url ? t(errors.credential_url.message as string) : t('certificates.urlHelper')}
                      placeholder="https://example.com/verify/123"
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
        <DialogTitle>{t('certificates.deleteCertification')}</DialogTitle>
        <DialogContent>
          <Typography>{t('certificates.deleteConfirm')}</Typography>
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

export default CertificationsForm;
