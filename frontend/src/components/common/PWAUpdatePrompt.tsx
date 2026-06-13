import { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Snackbar, Button, Alert, Box, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AUTO_UPDATE_DELAY = 4000;

const PWAUpdatePrompt = () => {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      if (registration) {
        // Comprobar actualizaciones cada 60 segundos
        setInterval(() => registration.update(), 60_000);
      }
    },
    onRegisterError(error: Error) {
      console.error('Error al registrar Service Worker:', error);
    },
  });

  const doUpdate = () => {
    if (updating) return;
    setUpdating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // updateServiceWorker(true) envía SKIP_WAITING y recarga
    updateServiceWorker(true);
  };

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // Auto-update después del delay
  useEffect(() => {
    if (!needRefresh || updating) return;

    timerRef.current = setTimeout(doUpdate, AUTO_UPDATE_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [needRefresh]);

  const secondsLeft = Math.round(AUTO_UPDATE_DELAY / 1000);

  return (
    <>
      {offlineReady && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={handleClose}>
            {t('pwa.offlineReady')}
          </Alert>
        </Snackbar>
      )}

      {needRefresh && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ mb: 2 }}
        >
          <Alert
            severity="info"
            action={
              !updating && (
                <Button color="inherit" size="small" onClick={doUpdate}>
                  {t('pwa.updateNow')}
                </Button>
              )
            }
            sx={{ width: '100%' }}
          >
            <Box>
              <strong>{t('pwa.updateAvailable')}</strong>
              <br />
              {updating
                ? t('pwa.updating')
                : t('pwa.autoUpdating', { seconds: secondsLeft })}
            </Box>
            {updating && <LinearProgress sx={{ mt: 1 }} />}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default PWAUpdatePrompt;
