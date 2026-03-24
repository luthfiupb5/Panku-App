import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateBalances, calculateSettlements, formatCurrency } from '../utils/calculations';
import { ArrowRight, TrendingUp, BarChart3, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const ResultsScreen: React.FC = () => {
    const { currentEvent } = useAppContext();

    const { balances, settlements, totalExpense, totalFund, totalSpentFromFund, remainingFund } = useMemo(() => {
        if (!currentEvent) return { balances: [], settlements: [], totalExpense: 0, totalFund: 0, totalSpentFromFund: 0, remainingFund: 0 };
        
        const calculatedBalances = calculateBalances(currentEvent);
        const totalExp = currentEvent.expenses.reduce((sum, e) => sum + e.amount, 0);
        
        const isFundMode = currentEvent.mode === 'fund';
        const tFund = isFundMode ? (currentEvent.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
        const tSpentFromFund = isFundMode ? currentEvent.expenses.reduce((s, e) => {
            if (e.poolUsed !== undefined) return s + e.poolUsed;
            const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
            return s + (e.amount - membersPaid);
        }, 0) : 0;
        const rFund = Math.max(0, tFund - tSpentFromFund);

        let balanceList = [...calculatedBalances];

        const calculatedSettlements = calculateSettlements(balanceList);
        
        return { 
            balances: calculatedBalances, // Keep original balances for UI
            settlements: calculatedSettlements, 
            totalExpense: totalExp,
            totalFund: tFund,
            totalSpentFromFund: tSpentFromFund,
            remainingFund: rFund
        };
    }, [currentEvent]);

    if (!currentEvent) return null;
    const isFundMode = currentEvent.mode === 'fund';

    const getMemberName = (id: string) => {
        return currentEvent.members.find(m => m.id === id)?.name ?? 'Unknown';
    };

    return (
        <div id="results-container" className="space-y-5">
            {/* Page header */}
            <div className="mb-2">
                <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Summary</h2>
                <p className="text-[#9AA4AF] text-sm mt-0.5">Final breakdown & settlements.</p>
            </div>

            {currentEvent.expenses.length === 0 ? (
                <div className="panku-card py-16 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#2DD4BF] mb-4 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <BarChart3 size={28} strokeWidth={1.5} />
                    </div>
                    <p className="text-[#F8FAFC] font-bold text-lg mb-1">No expenses to summarize</p>
                    <p className="text-[#94A3B8] text-sm">Add some expenses first to see the breakdown.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Total Expense hero card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[24px] p-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient"
                    >
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/30 rounded-full blur-2xl mix-blend-overlay" />
                        <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Expense</p>
                        <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(totalExpense)}</h3>
                        <div className="mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10">
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                        </div>
                    </motion.div>

                    {/* Fund Summary (Only in Fund Mode) */}
                    {isFundMode && (
                        <div className="panku-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/[0.04]">
                                <h3 className="font-bold text-[#E8EDF2]">Trip Pool Summary</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#94A3B8]">Initial Pool</span>
                                    <span className="font-bold text-[#E8EDF2]">{formatCurrency(totalFund)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#94A3B8]">Spent from Pool</span>
                                    <span className="font-bold text-[#EF4444]">{formatCurrency(totalSpentFromFund)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                    <span className="font-bold text-[#E8EDF2]">Remaining Pool</span>
                                    <span className={`font-black text-lg text-[#2DD4BF]`}>
                                        {formatCurrency(remainingFund)}
                                    </span>
                                </div>
                                {remainingFund > 0 && (
                                    <div className="mt-2 text-[11px] text-[#2DD4BF] bg-[#2DD4BF]/10 p-3 rounded-xl border border-[#2DD4BF]/20 leading-relaxed">
                                        The remaining <strong>{formatCurrency(remainingFund)}</strong> acts as a credit and is redistributed natively in the balances below.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Member balances */}
                    <div className="panku-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#2DD4BF]" />
                            <h3 className="font-bold text-[#E8EDF2]">Member Balances</h3>
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {balances.map((b, idx) => {
                                const name = getMemberName(b.memberId);
                                const balance = b.balance;
                                const isPositive = balance >= 0;
                                return (
                                    <motion.div
                                        key={b.memberId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center gap-4 px-5 py-4"
                                    >
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full ${getAvatarClass(name)} flex items-center justify-center font-bold text-[#030609] text-sm shrink-0`}
                                            style={{ boxShadow: `0 0 0 2px #141A21, 0 0 0 3px ${isPositive ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}
                                        >
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#F8FAFC] text-sm">{name}</p>
                                            <div className="flex gap-3 mt-0.5 flex-wrap">
                                                <span className="text-xs text-[#64748B]">Paid <span className="text-[#94A3B8] font-bold">{formatCurrency(b.totalPaid)}</span></span>
                                                <span className="text-xs text-[#64748B]">Share <span className="text-[#94A3B8] font-bold">{formatCurrency(b.totalShare)}</span></span>
                                            </div>
                                        </div>
                                        {/* Balance */}
                                        <div
                                            className={`px-3 py-1.5 rounded-xl text-sm font-black ${isPositive ? 'glow-teal bg-[#10B981]/10 text-[#10B981]' : 'glow-red bg-[#EF4444]/10 text-[#EF4444]'}`}
                                        >
                                            {isPositive ? '+' : ''}{formatCurrency(balance)}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Settlements */}
                    {settlements.length > 0 && (
                        <div className="panku-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2">
                                <ArrowRight size={16} className="text-[#2DD4BF]" />
                                <h3 className="font-bold text-[#E8EDF2]">Settlements</h3>
                                <span className="text-xs text-[#66707A] ml-auto">Who pays whom</span>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {settlements.map((s, idx) => {
                                    const fromName = getMemberName(s.from);
                                    const toName = getMemberName(s.to);
                                    const isFromFund = s.from === 'FUND_BOX';
                                    const isToFund = s.to === 'FUND_BOX';
                                    
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            className="flex items-center gap-3 px-5 py-4"
                                        >
                                            <span className={`w-9 h-9 rounded-full ${isFromFund ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20' : getAvatarClass(fromName)} text-xs font-bold text-[#030609] flex items-center justify-center shrink-0`}>
                                                {isFromFund ? 'FD' : fromName.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="flex-1 flex items-center gap-2 min-w-0">
                                                <span className={`font-medium text-sm truncate ${isFromFund ? 'text-[#2DD4BF]' : 'text-[#E8EDF2]'}`}>{fromName}</span>
                                                <ArrowRight size={14} className="text-[#64748B] shrink-0" />
                                                <span className={`font-medium text-sm truncate ${isToFund ? 'text-[#2DD4BF]' : 'text-[#E8EDF2]'}`}>{toName}</span>
                                            </div>
                                            <span className="font-extrabold text-[#E8EDF2] text-sm shrink-0">{formatCurrency(s.amount)}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {settlements.length === 0 && balances.length > 0 && (
                        <div className="panku-card p-6 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none hover:border-white/20">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] mb-4 border border-[#2DD4BF]/20 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                                <PartyPopper size={28} strokeWidth={1.5} />
                            </div>
                            <p className="text-[#2DD4BF] font-bold text-lg mb-1">All balances are settled!</p>
                            <p className="text-[#94A3B8] text-sm">No payments needed.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
