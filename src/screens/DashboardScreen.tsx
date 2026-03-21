import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/calculations';
import { UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const DashboardScreen: React.FC = () => {
    const { currentEvent, addMember, removeMember } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    if (!currentEvent) return null;

    const total = currentEvent.expenses.reduce((s, e) => s + e.amount, 0);

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newMemberName.trim();
        if (!trimmed) return;
        if (currentEvent.members.some(m => m.name.toLowerCase() === trimmed.toLowerCase())) {
            alert('Member exists'); 
            return;
        }
        addMember({ id: crypto.randomUUID(), name: trimmed });
        setNewMemberName('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            <div className="mb-2">
                <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Dashboard</h2>
                <p className="text-[#9AA4AF] text-sm mt-0.5">Overview of {currentEvent.name}.</p>
            </div>

            {/* Hero Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[24px] p-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient"
            >
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" />
                <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Event Cost</p>
                <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(total)}</h3>
                <div className="mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10">
                    <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                    <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                </div>
            </motion.div>

            {/* Members Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#E8EDF2]">Members</h3>
                    <button 
                        onClick={() => setIsAdding(!isAdding)} 
                        className="text-xs text-[#030609] bg-[#2DD4BF] hover:bg-[#14B8A6] px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors"
                    >
                        <UserPlus size={14} /> Add
                    </button>
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.form 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleAddMember} 
                            className="flex gap-2 mb-3 overflow-hidden"
                        >
                            <input 
                                className="panku-input flex-1 py-2.5 text-sm" 
                                placeholder="Member name..." 
                                value={newMemberName} 
                                onChange={e => setNewMemberName(e.target.value)} 
                                autoFocus 
                            />
                            <button type="submit" className="btn-teal px-5 py-2.5 rounded-xl font-bold text-sm shrink-0">
                                Save
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="panku-card overflow-hidden">
                    <div className="divide-y divide-white/[0.04]">
                        <AnimatePresence>
                            {currentEvent.members.map((member, i) => (
                                <motion.div 
                                    key={member.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between px-4 py-3 group hover:bg-white/[0.02]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[#030609] font-black text-sm ${getAvatarClass(member.name)} shadow-lg`}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-[#E8EDF2]">{member.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => { if(window.confirm(`Remove ${member.name}?`)) removeMember(member.id); }} 
                                        className="text-[#64748B] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/15 p-2 rounded-lg transition-colors flex shrink-0"
                                        title="Delete member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
