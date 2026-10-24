import { useEffect, useState, useCallback } from 'react';

/** 
 * PWA Install Prompt - mobile-only. Shows an "Install App" button when the site is
 * installable (Chrome/Edge/Android via beforeinstallprompt) and falls back
 * to iOS "Add to Home Screen" instructions on Safari.
 *
 * Desktop (viewport >= 768px): always hidden.
 * Mobile Chrome/Edge: shown once per session when beforeinstallprompt fires.
 * iOS Safari: shown once per session with Add to Home Screen instructions.
 *
 * Responsive: anytime the viewport changes from mobile to desktop while the
 * banner is open, it is dismissed.
 */
export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<Event | null>(null);
  const [showing, setShowing] = useState(false);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform || '');
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  // Already installed - nothing to show.
  if (isStandalone || dismissed) return null;

  // Detect mobile viewport
  const checkMobile = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) return;
    // Desktop: dismiss if banner is showing
    setShowing(false);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBeforeInstall = useCallback(
    (e: Event) => {
      e.preventDefault();
      setDeferred(e as Event);
      if (!isIOS && isMobile) setShowing(true);
    },
    [isIOS, isMobile]
  );

  const handleInstall = useCallback(async () => {
    if (!deferred) return;
    (deferred as any).prompt?.();
    setDeferred(null);
    setShowing(false);
    setDismissed(true);
  }, [deferred]);

  const handleDismiss = useCallback(() => {
    setShowing(false);
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (isIOS && !isStandalone && isMobile) {
      // iOS: show "Add to Home Screen" hint once per session
      setIos(true);
      setShowing(true);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [isIOS, isMobile]);

  // Never show on desktop
  if (!isMobile) return null;

  if (!showing) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-content">
        {ios ? (
          <>
            <strong>Install CIVIM GRAINS</strong>
            <p>Tap the <strong>Share</strong> icon, then <strong>Add to Home Screen</strong>.</p>
            <button className="pwa-install-dismiss" onClick={handleDismiss}>
              Got it
            </button>
          </>
        ) : (
          <>
            <strong>Install CIVIM GRAINS App</strong>
            <p>Get the app-like shopping experience on your home screen.</p>
            <button className="pwa-install-button" onClick={handleInstall}>
              Install
            </button>
            <button className="pwa-install-dismiss" onClick={handleDismiss}>
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
