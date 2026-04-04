import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/calculations';
import { UserPlus, Trash2, Edit3, Check, X, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const DashboardScreen: React.FC = () => {
    const { currentEvent, addMember, removeMember, updateMember } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editUpi, setEditUpi] = useState('');

    if (!currentEvent) return null;

    const totalEventCost = currentEvent.expenses.reduce((s, e) => s + e.amount, 0);

    const isFundMode = currentEvent.mode === 'fund';
    const totalFund = isFundMode ? (currentEvent.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
    
    // In Fund Mode, the "Spent" from the pool is explicitly tracked via poolUsed (with legacy fallback)
    const totalSpentFromFund = isFundMode 
        ? currentEvent.expenses.reduce((s, e) => {
            if (e.poolUsed !== undefined) return s + e.poolUsed;
            const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
            return s + (e.amount - membersPaid);
        }, 0) 
        : totalEventCost;

    const remainingFund = Math.max(0, totalFund - totalSpentFromFund);
    const usagePercent = totalFund > 0 ? Math.min((totalSpentFromFund / totalFund) * 100, 100) : 0;

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
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }} />
                
                {isFundMode ? (
                    <>
                        <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Trip Pool</p>
                        <h3 className="text-4xl font-black text-[#030609] tracking-tight mb-5">{formatCurrency(totalFund)}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                            <div>
                                <p className="text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Spent</p>
                                <p className="font-bold text-[#030609] text-lg leading-none">{formatCurrency(totalSpentFromFund)}</p>
                            </div>
                            <div>
                                <p className="text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Remaining</p>
                                <p className="font-bold text-[#030609] text-lg leading-none">{formatCurrency(remainingFund)}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-[#030609]/10 rounded-full h-1.5 w-full mb-1 relative z-10 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${remainingFund < 0 ? 'bg-red-500' : 'bg-[#030609]'}`}
                            />
                        </div>
                        <p className="text-[10px] text-[#030609]/70 font-semibold text-right relative z-10">{usagePercent.toFixed(0)}% Used</p>

                        <div className="mt-5 pt-4 border-t border-[#030609]/15 flex items-end justify-between relative z-10">
                            <div>
                                <p className="text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Total Event Cost</p>
                                <p className="font-black text-[#030609] text-xl leading-none">{formatCurrency(totalEventCost)}</p>
                            </div>
                            <div className="text-right text-xs">
                                <span className="text-[#030609]/70 block mb-0.5"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                                <span className="text-[#030609]/70 block"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Event Cost</p>
                        <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(totalEventCost)}</h3>
                        <div className="mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10">
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                        </div>
                    </>
                )}
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
                            {currentEvent.members.map((member, i) => {
                                const isEditing = editingId === member.id;
                                return (
                                    <motion.div 
                                        key={member.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between px-4 py-3 group hover:bg-white/[0.02]"
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
                                                                className="panku-input text-sm py-2 px-3 focus:border-[#2DD4BF]/50"
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
                                                    <div className="flex flex-col gap-2 justify-end shrink-0">
                                                        <button onClick={saveEdit} disabled={!editName.trim()} className="bg-[#2DD4BF] text-[#0B0F14] p-2 rounded-xl disabled:opacity-50 hover:bg-[#14B8A6] transition-colors">
                                                            <Check size={18} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition-colors">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[#030609] font-black text-sm ${getAvatarClass(member.name)} shadow-lg`}>
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-medium text-[#E8EDF2] truncate">{member.name}</span>
                                                        {member.upi_id && (
                                                            <span className="text-[10px] text-[#33DBC5] font-medium flex items-center gap-1 mt-0.5 truncate">
                                                                <QrCode size={10} /> {member.upi_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button 
                                                        onClick={() => startEdit(member)} 
                                                        className="text-[#9AA4AF] hover:text-[#2DD4BF] bg-white/5 hover:bg-[#2DD4BF]/15 p-2 rounded-lg transition-colors flex"
                                                        title="Edit member"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { if(window.confirm(`Remove ${member.name}?`)) removeMember(member.id); }} 
                                                        className="text-[#64748B] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/15 p-2 rounded-lg transition-colors flex"
                                                        title="Delete member"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
