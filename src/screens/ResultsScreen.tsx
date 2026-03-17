import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateBalances, calculateSettlements, formatCurrency } from '../utils/calculations';
import { generatePDF } from '../utils/pdfExport';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, ArrowRight, CheckCircle2, TrendingUp, BarChart3, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

// Chart colors - green palette
const CHART_COLORS = ['#9BE15D', '#00E3AE', '#6EF38D', '#2ED573', '#FFA502', '#FF6B9D', '#a78bfa', '#38bdf8'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="panku-card px-3 py-2.5 text-xs">
                {label && <p className="text-[#9AA4AF] mb-1 font-medium">{label}</p>}
                {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color }} className="font-bold">
                        {p.name}: {formatCurrency(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const ResultsScreen: React.FC = () => {
    const { currentEvent } = useAppContext();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const { balances, settlements, totalExpense, chartsData } = useMemo(() => {
        if (!currentEvent) return { balances: [], settlements: [], totalExpense: 0, chartsData: null };
        const calculatedBalances = calculateBalances(currentEvent);
        const calculatedSettlements = calculateSettlements(calculatedBalances);
        const totalExp = currentEvent.expenses.reduce((sum, e) => sum + e.amount, 0);
        const pieData = currentEvent.expenses.map(e => ({ name: e.title, value: e.amount }));
        const barData = calculatedBalances.map(b => ({
            name: currentEvent.members.find(m => m.id === b.memberId)?.name ?? 'Unknown',
            Paid: b.totalPaid,
            Share: b.totalShare
        }));
        return { balances: calculatedBalances, settlements: calculatedSettlements, totalExpense: totalExp, chartsData: { pieData, barData } };
    }, [currentEvent]);

    if (!currentEvent) return null;

    const getMemberName = (id: string) => currentEvent.members.find(m => m.id === id)?.name ?? 'Unknown';

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await generatePDF(currentEvent);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 2500);
        } catch (e) {
            console.error('Export failed:', e);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div id="report-container">
            {/* Page header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Summary</h2>
                    <p className="text-[#9AA4AF] text-sm mt-0.5">Final breakdown & settlements.</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={isExporting || currentEvent.expenses.length === 0}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                        exportSuccess
                            ? 'bg-[#2ED573]/20 text-[#2ED573] border border-[#2ED573]/40'
                            : 'btn-green disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                >
                    {exportSuccess ? <CheckCircle2 size={16} /> : <Download size={16} />}
                    {exportSuccess ? 'Downloaded!' : isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
            </div>

            {currentEvent.expenses.length === 0 ? (
                <div className="panku-card py-16 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#1CE8B7] mb-4 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
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
                        className="relative rounded-[24px] p-6 overflow-hidden shadow-[0_8px_32px_rgba(28,232,183,0.25)] border border-white/20"
                        style={{ background: 'linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)' }}
                    >
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/30 rounded-full blur-2xl mix-blend-overlay" />
                        <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Expense</p>
                        <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(totalExpense)}</h3>
                        <div className="mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10">
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                            <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                        </div>
                    </motion.div>

                    {/* Member balances */}
                    <div className="panku-card overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#9BE15D]" />
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
                                        <div className={`w-10 h-10 rounded-full ${getAvatarClass(name)} flex items-center justify-center font-bold text-[#0B0F14] text-sm shrink-0`}
                                            style={{ boxShadow: `0 0 0 2px #141A21, 0 0 0 3px ${isPositive ? 'rgba(46,213,115,0.4)' : 'rgba(255,71,87,0.4)'}` }}
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
                                            className={`px-3 py-1.5 rounded-xl text-sm font-black ${isPositive ? 'glow-green bg-[#2ED573]/10 text-[#2ED573]' : 'glow-red bg-[#FF4757]/10 text-[#FF4757]'}`}
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
                                <ArrowRight size={16} className="text-[#9BE15D]" />
                                <h3 className="font-bold text-[#E8EDF2]">Settlements</h3>
                                <span className="text-xs text-[#66707A] ml-auto">Who pays whom</span>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {settlements.map((s, idx) => {
                                    const fromName = getMemberName(s.from);
                                    const toName = getMemberName(s.to);
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            className="flex items-center gap-3 px-5 py-4"
                                        >
                                            <span className={`w-9 h-9 rounded-full ${getAvatarClass(fromName)} text-xs font-bold text-[#0B0F14] flex items-center justify-center shrink-0`}>
                                                {fromName.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="flex-1 flex items-center gap-2 min-w-0">
                                                <span className="text-[#E8EDF2] font-medium text-sm truncate">{fromName}</span>
                                                <ArrowRight size={14} className="text-[#9BE15D] shrink-0" />
                                                <span className="text-[#E8EDF2] font-medium text-sm truncate">{toName}</span>
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
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#1CE8B7]/10 flex items-center justify-center text-[#1CE8B7] mb-4 border border-[#1CE8B7]/20 shadow-[0_0_20px_rgba(28,232,183,0.15)]">
                                <PartyPopper size={28} strokeWidth={1.5} />
                            </div>
                            <p className="text-[#1CE8B7] font-bold text-lg mb-1">All balances are settled!</p>
                            <p className="text-[#94A3B8] text-sm">No payments needed.</p>
                        </div>
                    )}

                    {/* Charts */}
                    {chartsData && chartsData.pieData.length > 0 && (
                        <div className="space-y-4">
                            {/* Pie chart */}
                            <div className="panku-card p-5">
                                <h3 className="font-bold text-[#E8EDF2] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-gradient inline-block" />
                                    Expense Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={chartsData.pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                                            {chartsData.pieData.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar chart */}
                            <div className="panku-card p-5">
                                <h3 className="font-bold text-[#E8EDF2] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-gradient inline-block" />
                                    Paid vs Share
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={chartsData.barData} barCategoryGap="30%">
                                        <XAxis dataKey="name" tick={{ fill: '#9AA4AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#66707A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                        <Legend wrapperStyle={{ color: '#9AA4AF', fontSize: 12 }} />
                                        <Bar dataKey="Paid" fill="#9BE15D" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="Share" fill="#00E3AE" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
