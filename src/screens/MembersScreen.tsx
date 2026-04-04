import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, Users, Edit3, Check, X, QrCode } from 'lucide-react';

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
    const { currentEvent, addMember, removeMember, updateMember } = useAppContext();
    const [newMemberName, setNewMemberName] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editUpi, setEditUpi] = useState('');

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

    const startEdit = (member: any) => {
        setEditingId(member.id);
        setEditName(member.name);
        setEditUpi(member.upi_id || '');
    };

    const saveEdit = () => {
        if (!editingId || !editName.trim()) return;
        updateMember(editingId, { name: editName.trim(), upi_id: editUpi.trim() || undefined });
        setEditingId(null);
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
                                const isEditing = editingId === member.id;

                                return (
                                    <motion.li
                                        key={member.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 12 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        {isEditing ? (
                                            <div className="w-full flex flex-col gap-3 animation-fade-in py-1">
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-3">
                                                        <div>
                                                            <label className="block text-[10px] uppercase font-bold text-[#66707A] mb-1 ml-1">Name</label>
                                                            <input
                                                                value={editName}
                                                                onChange={e => setEditName(e.target.value)}
                                                                className="panku-input text-sm py-2 px-3 focus:border-[#9BE15D]/50"
                                                                placeholder="Name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] uppercase font-bold text-[#66707A] mb-1 ml-1">UPI ID (Optional)</label>
                                                            <input
                                                                value={editUpi}
                                                                onChange={e => setEditUpi(e.target.value)}
                                                                className="panku-input text-sm py-2 px-3 border-[#33DBC5]/30 focus:border-[#33DBC5]/60 bg-[#33DBC5]/5"
                                                                placeholder="e.g. name@okhdfcbank"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 justify-end">
                                                        <button onClick={saveEdit} disabled={!editName.trim()} className="bg-[#9BE15D] text-[#0B0F14] p-2 rounded-xl disabled:opacity-50">
                                                            <Check size={18} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="bg-white/10 text-white p-2 rounded-xl">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3.5 overflow-hidden">
                                                    {/* Colored ring avatar */}
                                                    <div
                                                        className={`w-10 h-10 rounded-full ${av.bg} flex items-center justify-center font-bold text-[#0B0F14] text-sm shrink-0`}
                                                        style={{ boxShadow: `0 0 0 2px #141A21, 0 0 0 4px ${av.ring}40` }}
                                                    >
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-semibold text-[#E8EDF2] text-sm truncate">{member.name}</span>
                                                        {member.upi_id && (
                                                            <span className="text-[10px] text-[#33DBC5] font-medium flex items-center gap-1 mt-0.5 max-w-[150px] truncate">
                                                                <QrCode size={10} /> {member.upi_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(member)}
                                                        className="text-[#9AA4AF] hover:text-[#9BE15D] p-2 rounded-xl hover:bg-[#9BE15D]/10 transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeMember(member.id)}
                                                        className="text-[#66707A] hover:text-[#FF4757] p-2 rounded-xl hover:bg-[#FF4757]/10 transition-all"
                                                    >
                                                        <UserMinus size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
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
