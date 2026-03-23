/**
 * PWAInstallPrompt.tsx
 * Handles PWA install prompts and native app install dialogs
 * Works on both web browsers and mobile devices
 */

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  className?: string;
}

export default function PWAInstallPrompt({ className = '' }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iosRegex = /iPad|iPhone|iPod/;
    const iOS = iosRegex.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detect Android
    const androidRegex = /Android/;
    const Android = androidRegex.test(navigator.userAgent);
    setIsAndroid(Android);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Listen for install success
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('✓ App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('✓ App install accepted');
        setShowPrompt(false);
      } else {
        console.log('✗ App install dismissed');
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // iOS manual install instructions
  if (isIOS && !isInstalled) {
    return (
      <div className={`pwa-prompt ios-prompt ${className}`}>
        <div className="pwa-prompt-content">
          <h3>📱 Install on Home Screen</h3>
          <p>Add Cabana Club to your home screen for quick access!</p>
          <ol className="install-steps">
            <li>Tap the <strong>Share</strong> button (↗️ bottom right)</li>
            <li>Scroll and select <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong></li>
          </ol>
          <button onClick={handleDismiss} className="dismiss-btn">
            Got it
          </button>
        </div>
      </div>
    );
  }

  // Android/Web install prompt (if available)
  if (showPrompt && deferredPrompt) {
    return (
      <div className={`pwa-prompt web-prompt ${className}`}>
        <div className="pwa-prompt-content">
          <h3>📱 Install App</h3>
          <p>Get quick access from your home screen!</p>
          <div className="button-group">
            <button onClick={handleInstallClick} className="install-btn">
              Install Now
            </button>
            <button onClick={handleDismiss} className="dismiss-btn">
              Not Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
