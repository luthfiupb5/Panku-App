import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, PartyPopper, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WelcomeScreen: React.FC = () => {
    const { createEvent } = useAppContext();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (eventName.trim()) {
            createEvent(eventName.trim(), eventDate);
        }
    };

    return (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
            {/* Content Container */}
            <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none" />

            <div className="w-full max-w-lg z-10 flex flex-col items-center">
                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-10"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 backdrop-blur-md shadow-sm mb-6 text-sm font-medium text-slate-400"
                     >
                        <Sparkles size={16} className="text-secondary-400" />
                        <span>Panku App v2.0 is here</span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Split expenses, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                            not friendships.
                        </span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                        Powered by smart algorithms. Designed for humans. Instantly calculate exactly who owes whom.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!showForm ? (
                        <motion.div
                            key="cta-button"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => setShowForm(true)}
                                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 px-8 font-medium text-white transition-all duration-300 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-primary-500/20 focus:outline-none active:scale-95"
                            >
                                <span className="mr-2">Create New Split</span>
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 text-primary-400" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="setup-form"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            onSubmit={handleSubmit}
                            className="w-full panku-card p-8 sm:p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-gradient" />
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-green-gradient/20 flex items-center justify-center text-[#9BE15D]">
                                    <PartyPopper size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Event Details</h2>
                                    <p className="text-slate-500 text-sm">Where are you heading?</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="eventName" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                        Event Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="eventName"
                                            type="text"
                                            required
                                            placeholder="e.g. Weekend in Kyoto"
                                            value={eventName}
                                            onChange={(e) => setEventName(e.target.value)}
                                            className="input-dark w-full pl-5 pr-4 py-4 font-medium text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="eventDate" className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                        Date
                                    </label>
                                    <input
                                        id="eventDate"
                                        type="date"
                                        required
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="input-dark w-full px-5 py-4 font-medium"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-green font-bold py-4 px-6 mt-4 flex justify-center items-center gap-2 group"
                                >
                                    <Users size={20} className="transition-transform group-hover:scale-110" />
                                    <span>Let's Add Members</span>
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-12 text-sm text-slate-400 text-center flex items-center gap-2"
                >
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Data strictly lives in your browser. 100% Privacy.
                </motion.p>
            </div>
        </div>
    );
};
