import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Users } from 'lucide-react';

const AVATAR_COLORS = [
    { ring: '#9BE15D', bg: 'avatar-0' },
    { ring: '#a78bfa', bg: 'avatar-1' },
    { ring: '#f472b6', bg: 'avatar-2' },
    { ring: '#fb923c', bg: 'avatar-3' },
    { ring: '#38bdf8', bg: 'avatar-4' },
    { ring: '#f43f5e', bg: 'avatar-5' },
    { ring: '#34d399', bg: 'avatar-6' },
    { ring: '#e879f9', bg: 'avatar-7' },
];
const getAvatar = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const MembersScreen: React.FC = () => {
    const { currentEvent, addMember, removeMember } = useAppContext();
    const [newMemberName, setNewMemberName] = useState('');

    if (!currentEvent) return null;

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newMemberName.trim();
        if (!trimmed) return;
        const exists = currentEvent.members.some(m => m.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) { alert('A member with this name already exists.'); return; }
        addMember({ id: crypto.randomUUID(), name: trimmed });
        setNewMemberName('');
    };

    return (
        <div>
            {/* Section header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Members</h2>
                    <p className="text-[#9AA4AF] text-sm mt-0.5">Who's joining the split?</p>
                </div>
                <span className="bg-[#9BE15D]/15 text-[#9BE15D] border border-[#9BE15D]/30 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                    <Users size={14} />
                    {currentEvent.members.length}
                </span>
            </div>

            {/* Add form */}
            <div className="panku-card p-5 mb-4">
                <form onSubmit={handleAddMember}>
                    <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-3">Add New Member</label>
                    <div className="flex gap-3">
                        <input
                            className="panku-input flex-1"
                            placeholder="Enter name (e.g. Luthfi)"
                            value={newMemberName}
                            onChange={e => setNewMemberName(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newMemberName.trim()}
                            className="btn-green disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 flex items-center gap-2 font-semibold text-sm rounded-xl"
                        >
                            <UserPlus size={18} />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Members list */}
            <div className="panku-card overflow-hidden">
                {currentEvent.members.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full panku-card-inner flex items-center justify-center mx-auto mb-4">
                            <Users size={28} className="text-[#66707A]" />
                        </div>
                        <p className="text-[#9AA4AF] font-medium">No members yet</p>
                        <p className="text-[#66707A] text-sm mt-1">Add people to start splitting.</p>
                    </div>
                ) : (
                    <ul>
                        <AnimatePresence>
                            {currentEvent.members.map((member, idx) => {
                                const av = getAvatar(member.name);
                                return (
                                    <motion.li
                                        key={member.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 12 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {/* Colored ring avatar */}
                                            <div
                                                className={`w-10 h-10 rounded-full ${av.bg} flex items-center justify-center font-bold text-[#0B0F14] text-sm shrink-0`}
                                                style={{ boxShadow: `0 0 0 2px #141A21, 0 0 0 4px ${av.ring}40` }}
                                            >
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-[#E8EDF2] text-sm">{member.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removeMember(member.id)}
                                            className="text-[#66707A] hover:text-[#FF4757] p-2 rounded-xl hover:bg-[#FF4757]/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            <UserMinus size={18} />
                                        </button>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </div>
    );
};
