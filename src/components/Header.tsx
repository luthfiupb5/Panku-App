import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft } from 'lucide-react';
import logoDarkBg from '../assets/logo-darkbg.png';

export const Header: React.FC = () => {
    const { currentEvent, setActiveEvent } = useAppContext();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.03]"
            style={{ 
                backgroundColor: 'rgba(5, 8, 12, 0.65)', 
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)' 
            }}
        >
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: back button in event view, logo on home */}
                {currentEvent ? (
                    <button
                        onClick={() => setActiveEvent(null)}
                        className="flex items-center gap-1.5 text-[#9AA4AF] hover:text-[#2DD4BF] transition-colors group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium">Events</span>
                    </button>
                ) : (
                    <div className="flex items-center">
                        <img src={logoDarkBg} alt="Panku Logo" className="h-8 object-contain drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]" />
                    </div>
                )}

                {/* Right: event badge when inside an event */}
                {currentEvent && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 panku-card-inner px-3 py-1.5 max-w-[50%]"
                        style={{ borderRadius: '10px' }}
                    >
                        <CalendarDays size={12} className="text-[#2DD4BF] shrink-0" />
                        <div className="min-w-0">
                            <p className="font-semibold text-[#E8EDF2] text-xs truncate">{currentEvent.name}</p>
                            <p className="text-[10px] text-[#66707A]">{new Date(currentEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                    </motion.div>
                )}

                {/* Panku logo on the right when inside event */}
                {currentEvent && (
                    <img src={logoDarkBg} alt="Panku Logo" className="h-6 object-contain" />
                )}
            </div>
        </header>
    );
};
