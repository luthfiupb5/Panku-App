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

    useEffect(() => {
        // Don't show if already running as installed PWA
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        // Don't show if user already dismissed
        if (localStorage.getItem(DISMISSED_KEY)) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
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
                    className="fixed bottom-24 left-4 right-4 z-50"
                >
                    <div
                        className="rounded-2xl p-4 flex items-center gap-4"
                        style={{
                            background: 'rgba(20, 26, 33, 0.92)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(28, 232, 183, 0.25)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
                        }}
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}>
                            <Download size={20} className="text-[#0B0F14]" strokeWidth={2.5} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[#F8FAFC] font-bold text-sm leading-tight">Install Panku</p>
                            <p className="text-[#64748B] text-xs mt-0.5">Split expenses faster, works offline</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleInstall}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B0F14] transition-all active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#94A3B8] transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                aria-label="Dismiss"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
