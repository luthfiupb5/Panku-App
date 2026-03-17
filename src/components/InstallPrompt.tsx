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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-24 left-4 right-4 z-[9999]"
                >
                    <div
                        className="rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
                        style={{
                            background: 'rgba(11, 15, 20, 0.95)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(28, 232, 183, 0.3)',
                        }}
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}>
                            <Download size={22} className="text-[#0B0F14]" strokeWidth={2.5} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm leading-tight">Install Panku App</p>
                            <p className="text-slate-400 text-xs mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                {isIOS ? 'Tap Share → Add to Home Screen' : 'Fast, offline & ready on home screen'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                            <button
                                onClick={handleInstall}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F14] transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}
                            >
                                {isIOS ? 'How?' : 'Install'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                aria-label="Dismiss"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

