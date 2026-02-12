import ReactGA from 'react-ga4';

// Inicializar Google Analytics
export const initGA = () => {
  const googleId = import.meta.env.VITE_GOOGLE_ID;
  
  if (googleId) {
    ReactGA.initialize(googleId, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    console.log('Google Analytics inicializado con ID:', googleId);
  } else {
    console.warn('VITE_GOOGLE_ID no está configurado en las variables de entorno');
  }
};

// Registrar visita a página
export const logPageView = () => {
  ReactGA.send({ 
    hitType: 'pageview', 
    page: window.location.pathname + window.location.search 
  });
};

// Eventos personalizados
export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

// Eventos específicos de la aplicación
export const analyticsEvents = {
  // Autenticación
  login: (method: string) => {
    logEvent('Auth', 'Login', method);
  },
  register: () => {
    logEvent('Auth', 'Register', 'New User');
  },
  logout: () => {
    logEvent('Auth', 'Logout', 'User Logout');
  },

  // Perfiles
  createProfile: (templateName: string) => {
    logEvent('Profile', 'Create Profile', templateName);
  },
  editProfile: (profileId: number) => {
    logEvent('Profile', 'Edit Profile', `Profile ${profileId}`);
  },
  deleteProfile: (profileId: number) => {
    logEvent('Profile', 'Delete Profile', `Profile ${profileId}`);
  },

  // Exportación
  exportPDF: (templateName: string, colorScheme: string) => {
    logEvent('Export', 'Export PDF', `${templateName} - ${colorScheme}`);
  },
  previewPDF: (templateName: string) => {
    logEvent('Export', 'Preview PDF', templateName);
  },
  selectTemplate: (templateName: string) => {
    logEvent('Export', 'Select Template', templateName);
  },
  selectColorScheme: (colorScheme: string) => {
    logEvent('Export', 'Select Color Scheme', colorScheme);
  },

  // Secciones del CV
  addExperience: () => {
    logEvent('CV Section', 'Add Experience', 'Work Experience');
  },
  editExperience: () => {
    logEvent('CV Section', 'Edit Experience', 'Work Experience');
  },
  deleteExperience: () => {
    logEvent('CV Section', 'Delete Experience', 'Work Experience');
  },
  addEducation: () => {
    logEvent('CV Section', 'Add Education', 'Education');
  },
  editEducation: () => {
    logEvent('CV Section', 'Edit Education', 'Education');
  },
  deleteEducation: () => {
    logEvent('CV Section', 'Delete Education', 'Education');
  },
  addSkill: () => {
    logEvent('CV Section', 'Add Skill', 'Skills');
  },
  editSkill: () => {
    logEvent('CV Section', 'Edit Skill', 'Skills');
  },
  deleteSkill: () => {
    logEvent('CV Section', 'Delete Skill', 'Skills');
  },
  addLanguage: () => {
    logEvent('CV Section', 'Add Language', 'Languages');
  },
  addCertification: () => {
    logEvent('CV Section', 'Add Certification', 'Certifications');
  },
  addSocialNetwork: () => {
    logEvent('CV Section', 'Add Social Network', 'Social Networks');
  },

  // Configuración
  changeTheme: (theme: string) => {
    logEvent('Settings', 'Change Theme', theme);
  },
  changeLanguage: (language: string) => {
    logEvent('Settings', 'Change Language', language);
  },

  // Clicks en botones importantes
  clickButton: (buttonName: string, location: string) => {
    logEvent('Button Click', buttonName, location);
  },

  // Navegación
  navigate: (from: string, to: string) => {
    logEvent('Navigation', 'Navigate', `${from} -> ${to}`);
  },

  // Errores
  error: (errorType: string, errorMessage: string) => {
    logEvent('Error', errorType, errorMessage);
  },
};
