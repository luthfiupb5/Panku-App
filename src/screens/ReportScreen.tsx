import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, calculateBalances } from '../utils/calculations';
import { generatePDF } from '../utils/pdfExport';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, CheckCircle2, BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

const CHART_COLORS = ['#38F2C2', '#33DBC5', '#41C6A6', '#48C1E7', '#FB9061'];

export const ReportScreen: React.FC = () => {
    const { currentEvent } = useAppContext();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const { chartsData } = useMemo(() => {
        if (!currentEvent) return { totalExpense: 0, chartsData: null };
        const total = currentEvent.expenses.reduce((sum, e) => sum + e.amount, 0);
        const pieData = currentEvent.expenses.reduce((acc: any[], exp) => {
            const existing = acc.find(a => a.name === exp.title);
            if (existing) existing.value += exp.amount;
            else acc.push({ name: exp.title, value: exp.amount });
            return acc;
        }, []).sort((a, b) => b.value - a.value).slice(0, 5);

        const balances = calculateBalances(currentEvent);
        const barData = balances.map(b => ({
            name: currentEvent.members.find(m => m.id === b.memberId)?.name ?? 'User',
            Paid: b.totalPaid,
            Share: b.totalShare
        }));

        return { totalExpense: total, chartsData: { pieData, barData } };
    }, [currentEvent]);

    if (!currentEvent) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await generatePDF(currentEvent);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
        } catch (e) {
            console.error('Export failed:', e);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-[#E5F3F2]">Report</h2>
                    <p className="text-[#8FA9B2] text-sm">Visual breakdown of your event.</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={isExporting || currentEvent.expenses.length === 0}
                    className={`btn-teal px-5 py-2.5 flex items-center gap-2 text-sm ${exportSuccess ? 'bg-success shadow-none' : ''}`}
                >
                    {exportSuccess ? <CheckCircle2 size={18} /> : <Download size={18} />}
                    {exportSuccess ? 'Saved!' : 'Export PDF'}
                </button>
            </div>

            {currentEvent.expenses.length === 0 ? (
                <div className="panku-card p-12 text-center border-dashed">
                    <BarChart3 size={48} className="mx-auto text-[#5C7280] mb-4" />
                    <p className="font-bold text-[#8FA9B2]">No analytics available yet</p>
                    <p className="text-[#5C7280] text-xs mt-1">Add expenses to see the magic happen.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Distribution Pie */}
                    <div className="panku-card p-5">
                        <div className="flex items-center gap-2 mb-6">
                            <PieIcon size={18} className="text-[#2DD4BF]" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#8FA9B2]">Expense Distribution</h3>
                        </div>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartsData?.pieData}
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartsData?.pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#132027', borderRadius: '12px', border: '1px solid #1E3A4A', color: '#E5F3F2' }}
                                        itemStyle={{ color: '#2DD4BF' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Member Bar Chart */}
                    <div className="panku-card p-5">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-[#2DD4BF]" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#8FA9B2]">Payments by Member</h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartsData?.barData}>
                                    <XAxis dataKey="name" stroke="#5C7280" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#5C7280" fontSize={10} axisLine={false} tickLine={false} hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#132027', borderRadius: '12px', border: '1px solid #1E3A4A' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Paid" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Share" fill="#33DBC5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Member Shares List */}
                    <div className="panku-card overflow-hidden">
                        <div className="flex items-center gap-2 p-5 border-b border-white/[0.04]">
                            <TrendingUp size={18} className="text-[#2DD4BF]" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#8FA9B2]">Individual Shares</h3>
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {chartsData?.barData.map((data, idx) => (
                                <div key={idx} className="flex justify-between items-center px-5 py-4">
                                    <span className="font-medium text-[#E5F3F2]">{data.name}</span>
                                    <span className="font-extrabold text-[#2DD4BF]">{formatCurrency(data.Share)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
