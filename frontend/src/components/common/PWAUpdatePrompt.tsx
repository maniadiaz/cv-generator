import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Snackbar, Button, Alert, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PWAUpdatePrompt = () => {
  const { t } = useTranslation();
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      console.log('Service Worker registrado:', swUrl);
      
      // Verificar actualizaciones cada 60 segundos
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60000);
      }
    },
    onRegisterError(error: Error) {
      console.error('Error al registrar Service Worker:', error);
    },
    onNeedRefresh() {
      console.log('Nueva versión disponible');
      setShowReload(true);
    },
    onOfflineReady() {
      console.log('App lista para funcionar offline');
    },
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Escuchar cambios en el service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nueva versión instalada, esperando activación');
                setWaitingWorker(newWorker);
                setShowReload(true);
              }
            });
          }
        });

        // Escuchar mensajes del service worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker actualizado, recargando página...');
          window.location.reload();
        });
      });
    }
  }, []);

  const handleUpdate = async () => {
    setShowReload(false);
    
    if (waitingWorker) {
      // Enviar mensaje SKIP_WAITING al service worker
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Usar el método de vite-plugin-pwa
      await updateServiceWorker(true);
    }
  };

  const handleClose = () => {
    setShowReload(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Auto-actualizar después de 3 segundos si hay una nueva versión
  useEffect(() => {
    if (showReload || needRefresh) {
      const timer = setTimeout(() => {
        console.log('Auto-actualizando aplicación...');
        handleUpdate();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showReload, needRefresh]);

  return (
    <>
      {offlineReady && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={handleClose}>
            {t('pwa.offlineReady') || 'App lista para funcionar sin conexión'}
          </Alert>
        </Snackbar>
      )}

      {(showReload || needRefresh) && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ mb: 2 }}
        >
          <Alert
            severity="info"
            icon={<CircularProgress size={20} />}
            action={
              <Button color="inherit" size="small" onClick={handleUpdate}>
                {t('pwa.updateNow') || 'Actualizar ahora'}
              </Button>
            }
          >
            <Box>
              <strong>{t('pwa.updateAvailable') || 'Nueva versión disponible'}</strong>
              <br />
              {t('pwa.autoUpdating') || 'Actualizando automáticamente en 3 segundos...'}
            </Box>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default PWAUpdatePrompt;
