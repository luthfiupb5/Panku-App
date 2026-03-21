import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Expense, PaymentContribution } from '../types';
import { X, Check } from 'lucide-react';

interface ExpenseFormProps {
    onCancel: () => void;
    onSave: () => void;
}

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onCancel, onSave }) => {
    const { currentEvent, addExpense } = useAppContext();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [isMultiPayer, setIsMultiPayer] = useState(false);
    const [singlePayerId, setSinglePayerId] = useState(currentEvent?.members[0]?.id ?? '');
    const [multiPayerAmounts, setMultiPayerAmounts] = useState<Record<string, string>>({});
    const [participants, setParticipants] = useState<Set<string>>(
        new Set(currentEvent?.members.map(m => m.id))
    );

    useEffect(() => {
        if (currentEvent?.members[0] && !singlePayerId) setSinglePayerId(currentEvent.members[0].id);
    }, [currentEvent, singlePayerId]);

    if (!currentEvent || currentEvent.members.length === 0) {
        return (
            <div className="panku-card p-5 text-center">
                <p className="text-[#FFA502] text-sm">Please add members before adding expenses.</p>
            </div>
        );
    }

    const toggleParticipant = (id: string) => {
        const next = new Set(participants);
        next.has(id) ? next.delete(id) : next.add(id);
        setParticipants(next);
    };

    const multiTotal = Object.values(multiPayerAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !amount || parseFloat(amount) <= 0) return;
        if (participants.size === 0) { alert('Select at least one participant.'); return; }

        const totalAmt = parseFloat(amount);
        let paidBy: PaymentContribution[] = [];

        if (isMultiPayer) {
            if (Math.abs(totalAmt - multiTotal) > 0.01) {
                alert(`Amounts don't match: paid ${multiTotal.toFixed(2)} vs ${totalAmt.toFixed(2)}`);
                return;
            }
            currentEvent.members.forEach(m => {
                const p = parseFloat(multiPayerAmounts[m.id]);
                if (p > 0) paidBy.push({ memberId: m.id, amount: p });
            });
            if (!paidBy.length) { alert('Enter payment amounts.'); return; }
        } else {
            paidBy = [{ memberId: singlePayerId, amount: totalAmt }];
        }

        addExpense({ id: crypto.randomUUID(), title: title.trim(), amount: totalAmt, paidBy, participants: Array.from(participants) } as Expense);
        onSave();
    };

    return (
        <div className="panku-card overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-gradient" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                <h3 className="font-bold text-[#E8EDF2] text-lg">Add Expense</h3>
                <button onClick={onCancel} className="text-[#66707A] hover:text-[#E8EDF2] p-1.5 rounded-lg hover:bg-white/5 transition-all">
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2">Expense Title</label>
                    <input
                        className="panku-input"
                        required
                        placeholder="e.g. Dinner, Bus Tickets, Hotel"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2">Amount (₹)</label>
                    <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="panku-input font-black text-2xl text-teal-gradient"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                {/* Who paid */}
                <div className="panku-card-inner p-4">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-[#E8EDF2]">Who Paid?</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#66707A]">Split Payment</span>
                            <button
                                type="button"
                                onClick={() => setIsMultiPayer(!isMultiPayer)}
                                className={`w-10 h-5 rounded-full transition-all relative ${isMultiPayer ? 'bg-teal-gradient' : 'bg-[#66707A]/40'}`}
                            >
                                <div className={`absolute top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform ${isMultiPayer ? 'left-5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    {!isMultiPayer ? (
                        <select
                            value={singlePayerId}
                            onChange={e => setSinglePayerId(e.target.value)}
                            className="panku-input"
                        >
                            {currentEvent.members.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    ) : (
                        <div className="space-y-3">
                            {currentEvent.members.map(m => (
                                <div key={m.id} className="flex items-center gap-3">
                                    <span className={`w-7 h-7 rounded-full ${getAvatarClass(m.name)} text-[10px] font-bold text-[#0B0F14] flex items-center justify-center shrink-0`}>
                                        {m.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="flex-1 text-sm text-[#E8EDF2] font-medium">{m.name}</span>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66707A] text-sm">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0"
                                            value={multiPayerAmounts[m.id] ?? ''}
                                            onChange={e => setMultiPayerAmounts({ ...multiPayerAmounts, [m.id]: e.target.value })}
                                            className="panku-input w-28 pl-7 pr-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                                <span className="text-xs text-[#66707A]">Total Split</span>
                                <span className={`text-sm font-bold ${Math.abs(parseFloat(amount||'0') - multiTotal) > 0.01 ? 'text-[#FF4757]' : 'text-[#2ED573]'}`}>
                                    ₹{multiTotal.toFixed(2)} / ₹{parseFloat(amount||'0').toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Participants - chips */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-[#E8EDF2]">Participants</label>
                        <button
                            type="button"
                            onClick={() => {
                                if (participants.size === currentEvent.members.length) setParticipants(new Set());
                                else setParticipants(new Set(currentEvent.members.map(m => m.id)));
                            }}
                            className="text-xs text-[#2DD4BF] font-semibold bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 px-2.5 py-1 rounded-lg transition-colors"
                        >
                            {participants.size === currentEvent.members.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentEvent.members.map(m => {
                            const sel = participants.has(m.id);
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => toggleParticipant(m.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-[14px] text-sm font-medium transition-all active:scale-95 border ${
                                        sel
                                            ? 'bg-gradient-to-br from-[#2DD4BF]/20 to-[#14B8A6]/10 border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_4px_12px_rgba(45,212,191,0.15)]'
                                            : 'panku-card-inner border-white/5 text-[#94A3B8] hover:border-white/15'
                                    }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${sel ? `bg-teal-gradient text-[#030609]` : 'bg-white/10 text-[#64748B]'}`}>
                                        {sel ? <Check size={12} strokeWidth={3} /> : m.name.charAt(0).toUpperCase()}
                                    </span>
                                    {m.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" className="w-full btn-teal font-bold py-4 text-base flex justify-center items-center gap-2">
                    <Check size={20} />
                    <span>Save Expense</span>
                </button>
            </form>
        </div>
    );
};
