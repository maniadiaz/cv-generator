import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Translate as LanguageIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { logout } from '@redux/slices/authSlice';
import { toggleTheme } from '@redux/slices/themeSlice';
import { userStorage } from '@utils/userStorage';
import AppIconSvg from '../../assets/icon.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  // Obtener usuario desde localStorage o Redux
  const user = userStorage.getUser();

  // Construir nombre completo del usuario
  const userDisplayName = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || t('common.user') || 'Usuario';

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexGrow: 1, minWidth: 0 }}>
            <Box
              component="img"
              src={AppIconSvg}
              alt="CV Generator"
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  cursor: 'pointer',
                },
              }}
              onClick={() => navigate('/dashboard')}
            />
            <Typography 
              variant="h5" 
              component="div"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 700,
                background: (theme) => theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              CV Generator
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip title={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')} arrow>
              <IconButton 
                onClick={handleToggleTheme}
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? 'inherit' : 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common.language')} arrow>
              <IconButton 
                onClick={handleOpenLangMenu}
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? 'inherit' : 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => handleChangeLanguage('es')}>Español</MenuItem>
              <MenuItem onClick={() => handleChangeLanguage('en')}>English</MenuItem>
            </Menu>

            <Tooltip title={userDisplayName} arrow>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar 
                  alt={userDisplayName} 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {userDisplayName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                {t('auth.logout')}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        <Box sx={{ p: 0, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
