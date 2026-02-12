import { Card, CardActionArea, CardContent, Typography, Box, alpha } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SvgIconComponent } from '@mui/icons-material';

interface SectionCardProps {
  title: string;
  description: string;
  icon: SvgIconComponent;
  path: string;
  count?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const SectionCard = ({
  title,
  description,
  icon: Icon,
  path,
  count,
  color = 'primary',
}: SectionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.shadows[12],
          borderColor: `${color}.main`,
          '& .section-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .arrow-icon': {
            transform: 'translateX(4px)',
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: (theme) => `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box
              className="section-icon"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 3,
                background: (theme) => 
                  `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
                color: 'white',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Icon sx={{ fontSize: 32 }} />
            </Box>
            {count !== undefined && (
              <Box
                sx={{
                  bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                  color: `${color}.main`,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {count}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              {title}
            </Typography>
            <ArrowIcon 
              className="arrow-icon"
              sx={{ 
                color: `${color}.main`,
                opacity: 0.5,
                transition: 'all 0.3s ease',
              }} 
            />
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SectionCard;
