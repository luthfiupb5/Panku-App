import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './screens/HomeScreen';
import { MembersScreen } from './screens/MembersScreen';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { Users, Receipt, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

type Tab = 'members' | 'expenses' | 'results';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'members',  label: 'Members',  icon: <Users size={20} /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
    { id: 'results',  label: 'Summary',  icon: <PieChart size={20} /> },
];

const AppContent: React.FC = () => {
    const { currentEvent } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('expenses');

    // No active event → show the Home screen
    if (!currentEvent) {
        return (
            <div className="min-h-screen bg-transparent">
                <HomeScreen />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
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
                        {activeTab === 'members'  && <MembersScreen />}
                        {activeTab === 'expenses' && <ExpensesScreen />}
                        {activeTab === 'results'  && <ResultsScreen />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Floating pill navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
                <nav
                    className="pointer-events-auto flex items-center gap-1 p-2 rounded-2xl"
                    style={{
                        background: 'rgba(15, 20, 28, 0.75)',
                        backdropFilter: 'blur(32px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 16px 40px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                >
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative flex flex-col items-center justify-center px-6 py-2.5 rounded-xl focus:outline-none transition-all"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-tab-bg"
                                        className="absolute inset-0 rounded-xl"
                                        style={{ background: 'linear-gradient(135deg, #9BE15D 0%, #00E3AE 100%)' }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className={`relative flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-[#0B0F14]' : 'text-[#9AA4AF] hover:text-[#E8EDF2]'}`}>
                                    {/* Badge for expenses count */}
                                    <span className="relative">
                                        {tab.icon}
                                        {tab.id === 'expenses' && currentEvent.expenses.length > 0 && !isActive && (
                                            <span className="absolute -top-1 -right-2.5 bg-[#9BE15D] text-[#0B0F14] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                                {currentEvent.expenses.length}
                                            </span>
                                        )}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider`}>{tab.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export const App: React.FC = () => (
    <AppProvider>
        {/* Global Animated Background Mesh */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#9BE15D] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04] animate-blob" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#00E3AE] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-15%] left-[10%] w-[600px] h-[600px] bg-[#2ED573] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.03] animate-blob animation-delay-4000" />
            <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0B0F14] rounded-full mix-blend-overlay filter blur-[80px] opacity-[0.8]" />
            <div className="absolute inset-0 bg-[#05080c] mix-blend-overlay opacity-90"></div>
        </div>
        <AppContent />
        <InstallPrompt />
        <Analytics />
    </AppProvider>
);

export default App;
