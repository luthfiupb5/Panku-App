import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Receipt, ArrowRight, Trash2, X, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import logoDarkBg from '../assets/logo-darkbg.png';

const CreateEventModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { createEvent } = useAppContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState<'normal' | 'fund'>('normal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        createEvent(name.trim(), date, [], mode);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-full max-w-md panku-card overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Teal top bar */}
                <div className="h-1 w-full bg-teal-gradient" />

                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#E8EDF2]">Create New Event</h2>
                        <button onClick={onClose} className="text-[#66707A] hover:text-[#E8EDF2] p-1.5 rounded-lg hover:bg-white/5 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2">Event Name</label>
                            <input
                                className="panku-input"
                                required
                                placeholder="e.g. Goa Trip, Office Lunch"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2">Date</label>
                            <input
                                type="date"
                                className="panku-input"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        {/* Event Mode */}
                        <div>
                            <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-3">Expense Mode</label>
                            
                            <div className="space-y-3">
                                <label className={`flex items-start gap-3 p-3 rounded-[14px] border ${mode === 'normal' ? 'border-[#2DD4BF] bg-[#2DD4BF]/10' : 'border-white/10 opacity-70'} cursor-pointer transition-all`}>
                                    <div className="pt-1">
                                        <input type="radio" name="mode" value="normal" checked={mode === 'normal'} onChange={() => setMode('normal')} className="accent-[#2DD4BF] w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${mode === 'normal' ? 'text-[#2DD4BF]' : 'text-[#E8EDF2]'}`}>Split Expenses Normally</p>
                                        <p className="text-xs text-[#9AA4AF] mt-0.5">Current system. Add expenses and select who paid.</p>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-3 p-3 rounded-[14px] border ${mode === 'fund' ? 'border-[#2DD4BF] bg-[#2DD4BF]/10' : 'border-white/10 opacity-70'} cursor-pointer transition-all`}>
                                    <div className="pt-1">
                                        <input type="radio" name="mode" value="fund" checked={mode === 'fund'} onChange={() => setMode('fund')} className="accent-[#2DD4BF] w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${mode === 'fund' ? 'text-[#2DD4BF]' : 'text-[#E8EDF2]'}`}>Use Trip Pool <span className="opacity-70">(Initial Deposit)</span></p>
                                        <p className="text-xs text-[#9AA4AF] mt-0.5">Everyone contributes money to a common pool. Expenses are paid from that pool.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn-teal w-full py-4 text-base font-bold">
                            Create Event
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const HomeScreen: React.FC = () => {
    const { events, setActiveEvent, deleteEvent } = useAppContext();
    const [showCreate, setShowCreate] = useState(false);

    const getTotalExpense = (event: { expenses: { amount: number }[] }) =>
        event.expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col pb-8">
            {/* Header */}
            <div className="px-5 pt-8 pb-4">
                <div className="flex items-center gap-2.5 mb-6">
                    <img src={logoDarkBg} alt="Panku Logo" className="h-10 object-contain drop-shadow-[0_0_20px_rgba(45,212,191,0.3)]" />
                </div>

                <p className="text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-1">Welcome back</p>
                <h1 className="text-3xl font-extrabold text-[#E8EDF2] leading-tight">
                    Split expenses,<br />
                    <span className="text-teal-gradient">stay friends.</span>
                </h1>
            </div>

            {/* Events list */}
            <div className="flex-1 px-5 pt-2 flex flex-col">
                {events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center -mt-20"
                    >
                        <div className="mb-6 drop-shadow-[0_20px_40px_rgba(45,212,191,0.3)] animate-float text-[#2DD4BF]">
                            <Receipt size={100} strokeWidth={1} />
                        </div>
                        <h2 className="text-[#F8FAFC] font-black text-3xl mb-3 tracking-tight">No events yet</h2>
                        <p className="text-[#94A3B8] text-base mb-10 max-w-[240px]">Create an event to start splitting expenses with friends.</p>
                        <button 
                            onClick={() => setShowCreate(true)}
                            className="btn-teal px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(45,212,191,0.4)]"
                        >
                            <Plus size={24} strokeWidth={3} />
                            Create First Event
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-3">Your Events</p>
                        <AnimatePresence>
                            {events.map((event, idx) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="panku-card p-5 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#E8EDF2] text-lg leading-tight">{event.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Calendar size={12} className="text-[#66707A]" />
                                                <p className="text-[#66707A] text-xs">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete "${event.name}"?`)) deleteEvent(event.id); }}
                                            className="text-[#66707A] hover:text-[#FF4757] p-2 rounded-xl hover:bg-[#FF4757]/10 transition-all bg-white/5"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Stats row */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-[#9AA4AF] text-sm">
                                            <Users size={14} className="text-[#2DD4BF]" />
                                            <span>{event.members.length} Members</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[#9AA4AF] text-sm">
                                            <Receipt size={14} className="text-[#2DD4BF]" />
                                            <span>{event.expenses.length} Expenses</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[#66707A] text-xs mb-0.5">Total Expense</p>
                                            <p className="text-[#E8EDF2] font-extrabold text-xl">{formatCurrency(getTotalExpense(event))}</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveEvent(event.id)}
                                            className="flex items-center gap-2 text-[#2DD4BF] font-semibold text-sm bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 px-4 py-2 rounded-xl transition-all active:scale-95"
                                        >
                                            View Details
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* FAB */}
            {events.length > 0 && (
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCreate(true)}
                    className="fab-teal fixed bottom-8 right-6 z-40"
                    title="Create Event"
                >
                    <Plus size={26} strokeWidth={2.5} />
                </motion.button>
            )}

            <AnimatePresence>
                {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} />}
            </AnimatePresence>
        </div>
    );
};
