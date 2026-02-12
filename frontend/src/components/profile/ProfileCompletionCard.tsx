import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ProfileCompletionCardProps {
  completionPercentage: number;
}

const ProfileCompletionCard = ({ completionPercentage }: ProfileCompletionCardProps) => {
  const { t } = useTranslation();

  const getCompletionColor = (percentage: number) => {
    if (percentage < 30) return 'error';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('profile.completion')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage || 0}
              color={getCompletionColor(completionPercentage || 0)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h6" color="text.secondary">
            {completionPercentage || 0}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
