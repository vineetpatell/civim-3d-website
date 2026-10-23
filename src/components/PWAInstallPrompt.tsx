import { useEffect, useState, useCallback } from 'react'

/**
 * PWA Install Prompt — shows an "Install App" button when the site is
 * installable (Chrome/Edge/Android via beforeinstallprompt) and falls back
 * to iOS "Add to Home Screen" instructions on Safari.
 *
 * Only shows once per session unless dismissed. Clicking Install triggers the
 * native install flow; on iOS it shows a share-sheet instruction overlay.
 */
export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<Event | null>(null)
  const [showing, setShowing] = useState(false)
  const [ios, setIos] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform || '')
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true

  // Already installed — nothing to show.
  if (isStandalone || dismissed) return null

  const handleBeforeInstall = useCallback(
    (e: Event) => {
      e.preventDefault()
      setDeferred(e as Event)
      if (!isIOS) setShowing(true)
    },
    []
  )

  const handleInstall = useCallback(async () => {
    if (!deferred) return
    ;(deferred as any).prompt?.()
    setDeferred(null)
    setShowing(false)
    setDismissed(true)
  }, [deferred])

  const handleDismiss = useCallback(() => {
    setShowing(false)
    setDismissed(true)
  }, [])

  useEffect(() => {
    if (isIOS && !isStandalone) {
      // iOS: show "Add to Home Screen" hint once
      setIos(true)
      setShowing(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  if (!showing) return null

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
  )
}