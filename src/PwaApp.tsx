import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './screens/HomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ReportScreen } from './screens/ReportScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { FundDepositsScreen } from './screens/FundDepositsScreen';
import { Home, Receipt, PieChart, BarChart3, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'home' | 'fund' | 'expenses' | 'summary' | 'report';

const AppContent: React.FC = () => {
    const { currentEvent } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('home');

    // No active event → show the Home screen
    if (!currentEvent) {
        return (
            <div className="min-h-[100dvh] w-full overflow-x-hidden bg-transparent">
                <HomeScreen />
            </div>
        );
    }

    const isFundMode = currentEvent.mode === 'fund';
    const iconSize = isFundMode ? 18 : 20;
    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = isFundMode ? [
        { id: 'home',     label: 'Home',     icon: <Home size={iconSize} /> },
        { id: 'fund',     label: 'Deposits', icon: <Wallet size={iconSize} /> },
        { id: 'expenses', label: 'Expenses', icon: <Receipt size={iconSize} /> },
        { id: 'summary',  label: 'Summary',  icon: <PieChart size={iconSize} /> },
        { id: 'report',   label: 'Report',   icon: <BarChart3 size={iconSize} /> },
    ] : [
        { id: 'home',     label: 'Home',     icon: <Home size={iconSize} /> },
        { id: 'expenses', label: 'Expenses', icon: <Receipt size={iconSize} /> },
        { id: 'summary',  label: 'Summary',  icon: <PieChart size={iconSize} /> },
        { id: 'report',   label: 'Report',   icon: <BarChart3 size={iconSize} /> },
    ];

    return (
        <div className="min-h-[100dvh] w-full overflow-x-hidden bg-transparent flex flex-col">
            <Header />

            {/* Main content */}
            <main className="flex-1 w-full max-w-lg mx-auto px-4 py-5 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                        {activeTab === 'home'     && <DashboardScreen />}
                        {activeTab === 'fund'     && <FundDepositsScreen />}
                        {activeTab === 'expenses' && <ExpensesScreen />}
                        {activeTab === 'summary'  && <ResultsScreen />}
                        {activeTab === 'report'   && <ReportScreen />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom navigation */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
                style={{
                    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                }}
            >
                <nav
                    className="pointer-events-auto flex items-stretch w-full rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(10, 28, 40, 0.92)',
                        backdropFilter: 'blur(32px)',
                        WebkitBackdropFilter: 'blur(32px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 16px 40px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                        padding: '6px',
                        gap: '2px',
                    }}
                >
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ flex: '1 1 0', minWidth: 0 }}
                                className="relative flex flex-col items-center justify-center py-2 rounded-xl focus:outline-none transition-all"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-tab-bg"
                                        className="absolute inset-0 rounded-xl bg-teal-gradient"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span
                                    className="relative flex flex-col items-center transition-colors duration-200"
                                    style={{ gap: '3px', color: isActive ? '#030609' : '#9AA4AF' }}
                                >
                                    <span className="relative flex-shrink-0">
                                        {tab.icon}
                                        {tab.id === 'expenses' && currentEvent.expenses.length > 0 && !isActive && (
                                            <span className="absolute -top-1 -right-2.5 bg-[#2DD4BF] text-[#030609] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                                {currentEvent.expenses.length}
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: isFundMode ? '8px' : '9px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            lineHeight: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%',
                                        }}
                                    >
                                        {tab.label}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export const PwaApp: React.FC = () => (
    <AppProvider>
        {/* Global Animated Background Mesh */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04] animate-blob" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#2DD4BF] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-15%] left-[10%] w-[600px] h-[600px] bg-[#38F2C2] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.03] animate-blob animation-delay-4000" />
            <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0A1C28] rounded-full mix-blend-overlay filter blur-[80px] opacity-[0.8]" />
            <div className="absolute inset-0 bg-[#05080c] mix-blend-overlay opacity-90"></div>
        </div>
        <AppContent />
        <InstallPrompt />
    </AppProvider>
);

export default PwaApp;
