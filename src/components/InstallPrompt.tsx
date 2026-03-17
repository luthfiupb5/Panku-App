import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'panku-install-dismissed';

export const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Debug logs
        console.log('[PWA] Standalone mode:', window.matchMedia('(display-mode: standalone)').matches);
        console.log('[PWA] Dismissed:', !!localStorage.getItem(DISMISSED_KEY));
        console.log('[PWA] iOS detected:', isIOSDevice);

        // Don't show if already running as installed PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
             console.log('[PWA] Already in standalone mode');
             return;
        }
        
        // Show automatically for iOS if not dismissed
        if (isIOSDevice && !localStorage.getItem(DISMISSED_KEY)) {
            setVisible(true);
        }

        const handler = (e: Event) => {
            console.log('[PWA] beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            if (!localStorage.getItem(DISMISSED_KEY)) {
                setVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            alert('To install Panku on your iPhone: \n1. Tap the Share button (square with arrow up) \n2. Scroll down and tap "Add to Home Screen"');
            handleDismiss();
            return;
        }
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setVisible(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem(DISMISSED_KEY, '1');
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="fixed bottom-28 left-0 right-0 z-[9999] px-6 flex justify-center pointer-events-none"
                >
                    <div
                        className="pointer-events-auto rounded-3xl p-5 w-full max-w-sm flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                        style={{
                            background: 'rgba(13, 18, 25, 0.98)',
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)',
                            border: '1px solid rgba(28, 232, 183, 0.4)',
                        }}
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20"
                            style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}>
                            <Download size={24} className="text-[#0B0F14]" strokeWidth={2.5} />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0" onClick={handleInstall} style={{ cursor: 'pointer' }}>
                            <p className="text-white font-black text-base leading-tight">Install Panku App</p>
                            <p className="text-[#1CE8B7] font-bold text-sm mt-0.5 underline decoration-2 underline-offset-4 active:opacity-70 transition-opacity">
                                {isIOS ? 'Tap Share → Add to Screen' : 'To install, click here'}
                            </p>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={handleDismiss}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors shrink-0"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            aria-label="Dismiss"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

