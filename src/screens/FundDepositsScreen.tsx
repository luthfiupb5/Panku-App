import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/calculations';
import { Trash2, Plus, Wallet, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const FundDepositsScreen: React.FC = () => {
    const { currentEvent, addFundDeposit, removeFundDeposit } = useAppContext();
    const [selectedMember, setSelectedMember] = useState('');
    const [amount, setAmount] = useState('');

    if (!currentEvent || currentEvent.mode !== 'fund') return null;

    const totalFund = (currentEvent.fundDeposits || []).reduce((acc, d) => acc + d.amount, 0);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember || !amount) return;
        
        addFundDeposit({
            memberId: selectedMember,
            amount: parseFloat(amount),
            date: new Date().toISOString()
        });
        setAmount('');
        setSelectedMember('');
    };

    return (
        <div className="pb-24">
            <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Deposits</h2>
                <p className="text-[#9AA4AF] text-sm mt-0.5">Manage the shared trip pool.</p>
            </div>

            {/* Total Fund Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[24px] p-6 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient"
            >
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" />
                <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Pool</p>
                <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(totalFund)}</h3>
                <div className="mt-2 text-sm text-[#030609]/80 font-medium z-10 relative">
                    {currentEvent.fundDeposits?.length || 0} Deposits Collected
                </div>
            </motion.div>

            {/* Add Deposit Form */}
            <div className="panku-card p-5 mb-6">
                <h3 className="text-sm font-bold text-[#E8EDF2] mb-4 uppercase tracking-wider">Add Deposit</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <select 
                                className="panku-input"
                                value={selectedMember}
                                onChange={e => setSelectedMember(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Member</option>
                                {currentEvent.members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                                <IndianRupee size={16} />
                            </span>
                            <input
                                type="number"
                                required
                                min="1"
                                step="any"
                                className="panku-input pl-8"
                                placeholder="Amount"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-teal w-full py-3 font-bold flex items-center justify-center gap-2">
                        <Plus size={18} /> Add to Pool
                    </button>
                </form>
            </div>

            {/* Deposits List */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-3">Recent Deposits</h3>
                {(!currentEvent.fundDeposits || currentEvent.fundDeposits.length === 0) ? (
                    <div className="panku-card py-10 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none">
                        <Wallet size={24} className="mx-auto text-[#64748B] mb-2" />
                        <p className="text-[#94A3B8] text-sm">No deposits yet. Add one above.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {currentEvent.fundDeposits.map((deposit) => {
                            const memberName = currentEvent.members.find(m => m.id === deposit.memberId)?.name || 'Unknown';
                            return (
                                <motion.div
                                    key={deposit.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="panku-card p-4 flex items-center gap-3 group"
                                >
                                    <div className={`w-10 h-10 rounded-full ${getAvatarClass(memberName)} flex items-center justify-center text-[#0B0F14] font-bold shrink-0`}>
                                        {memberName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-[#E8EDF2] text-sm">{memberName}</p>
                                        <p className="text-xs text-[#66707A]">{new Date(deposit.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className="font-black text-[#2DD4BF]">{formatCurrency(deposit.amount)}</span>
                                        <button
                                            type="button"
                                            onClick={() => { if (window.confirm('Delete deposit?')) removeFundDeposit(deposit.id); }}
                                            className="text-[#64748B] hover:text-[#FF4757] p-1.5 rounded-lg transition-colors bg-white/5"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};
