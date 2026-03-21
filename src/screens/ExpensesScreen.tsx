import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ExpenseForm } from '../components/ExpenseForm';
import { formatCurrency } from '../utils/calculations';
import { Plus, Trash2, Utensils, Plane, CarTaxiFront, ShoppingCart, Hotel, Coffee, Film, PartyPopper, Beer, Fuel, Pill, Home, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Icon category auto-detection
const getCategoryIcon = (title: string) => {
    const t = title.toLowerCase();
    if (/dinner|food|restaurant|lunch|breakfast|meal|eat/.test(t)) return <Utensils size={24} strokeWidth={1.5} />;
    if (/travel|flight|air|ticket|train|bus/.test(t)) return <Plane size={24} strokeWidth={1.5} />;
    if (/taxi|cab|uber|ola|auto|ride/.test(t)) return <CarTaxiFront size={24} strokeWidth={1.5} />;
    if (/grocery|groceries|market|shopping/.test(t)) return <ShoppingCart size={24} strokeWidth={1.5} />;
    if (/hotel|stay|accommodation|hostel|resort/.test(t)) return <Hotel size={24} strokeWidth={1.5} />;
    if (/coffee|cafe|tea|brew/.test(t)) return <Coffee size={24} strokeWidth={1.5} />;
    if (/movie|cinema|film|show/.test(t)) return <Film size={24} strokeWidth={1.5} />;
    if (/party|birthday|celebrate|fest/.test(t)) return <PartyPopper size={24} strokeWidth={1.5} />;
    if (/beer|alcohol|bar|pub|drinks/.test(t)) return <Beer size={24} strokeWidth={1.5} />;
    if (/petrol|fuel|gas|diesel/.test(t)) return <Fuel size={24} strokeWidth={1.5} />;
    if (/medicine|medical|doctor|hospital/.test(t)) return <Pill size={24} strokeWidth={1.5} />;
    if (/rent|house|flat|pg/.test(t)) return <Home size={24} strokeWidth={1.5} />;
    return <Banknote size={24} strokeWidth={1.5} />;
};

const AVATAR = ['avatar-0','avatar-1','avatar-2','avatar-3','avatar-4','avatar-5','avatar-6','avatar-7'];
const getAvatarClass = (name: string) => AVATAR[name.charCodeAt(0) % AVATAR.length];

export const ExpensesScreen: React.FC = () => {
    const { currentEvent, removeExpense } = useAppContext();
    const [showAddForm, setShowAddForm] = useState(false);

    if (!currentEvent) return null;

    const total = currentEvent.expenses.reduce((s, e) => s + e.amount, 0);
    const isFundMode = currentEvent.mode === 'fund';

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#E8EDF2]">Expenses</h2>
                    <p className="text-[#9AA4AF] text-sm mt-0.5">Track every shared cost.</p>
                </div>
                {!showAddForm && (
                    <button onClick={() => setShowAddForm(true)} className="fab-teal w-11 h-11" title="Add Expense">
                        <Plus size={22} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* Total Expense card */}
            {!showAddForm && currentEvent.expenses.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[24px] p-6 mb-5 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient"
                >
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" />
                    <p className="text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2">Total Event Cost</p>
                    <h3 className="text-4xl font-black text-[#030609] tracking-tight">{formatCurrency(total)}</h3>
                    <div className="mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10">
                        <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.expenses.length}</span> Expenses</span>
                        <span className="text-[#030609]/70"><span className="font-bold text-[#030609]">{currentEvent.members.length}</span> Members</span>
                    </div>
                </motion.div>
            )}

            {/* Form or list */}
            {showAddForm ? (
                <ExpenseForm onCancel={() => setShowAddForm(false)} onSave={() => setShowAddForm(false)} />
            ) : (
                <div className="space-y-3">
                    {currentEvent.expenses.length === 0 ? (
                        <div className="panku-card py-16 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none hover:border-white/20">
                            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#2DD4BF] mb-4 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <Banknote size={28} strokeWidth={1.5} />
                            </div>
                            <p className="text-[#F8FAFC] font-bold text-lg mb-1">No expenses yet</p>
                            <p className="text-[#94A3B8] text-sm mb-6 max-w-[200px] mx-auto">Tap <strong className="text-[#2DD4BF]">+</strong> to add your first expense.</p>
                            <button onClick={() => setShowAddForm(true)} className="btn-teal px-6 py-3 font-semibold inline-flex items-center gap-2">
                                <Plus size={18} />Add First Expense
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {currentEvent.expenses.map((expense, idx) => {
                                const paidBy = expense.paidBy.map(p => ({
                                    name: currentEvent.members.find(m => m.id === p.memberId)?.name ?? 'Unknown',
                                    amount: p.amount
                                }));
                                return (
                                    <motion.div
                                        key={expense.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                        transition={{ delay: idx * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
                                        className="panku-card p-4 flex items-center gap-4 group"
                                    >
                                        {/* Icon */}
                                        <div className="w-12 h-12 rounded-[14px] panku-card-inner flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform text-[#2DD4BF]">
                                            {getCategoryIcon(expense.title)}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-[#E8EDF2] text-sm truncate">{expense.title}</h4>
                                                <span className="text-[10px] text-[#9AA4AF] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full shrink-0">
                                                    {expense.participants.length} people
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-wrap gap-1 mt-1">
                                                {(() => {
                                                    const membersPaidSum = expense.paidBy.reduce((acc, p) => acc + p.amount, 0);
                                                    const fundPaidAmount = expense.amount - membersPaidSum;
                                                    const hasFundPayment = isFundMode && fundPaidAmount > 0.01;
                                                    
                                                    if (!hasFundPayment && paidBy.length === 0) return null;

                                                    return (
                                                        <>
                                                            <span className="text-xs text-[#66707A]">Paid by</span>
                                                            {hasFundPayment && (
                                                                <span className="text-[10px] text-[#2DD4BF] font-black uppercase tracking-wider bg-[#2DD4BF]/10 px-1.5 py-0.5 rounded flex items-center border border-[#2DD4BF]/20">
                                                                    Fund {(paidBy.length > 0) && `(${formatCurrency(fundPaidAmount)})`}
                                                                </span>
                                                            )}
                                                            {paidBy.map(({ name, amount }) => (
                                                                <span key={name} className="flex items-center gap-1">
                                                                    <span className={`w-4 h-4 rounded-full ${getAvatarClass(name)} text-[8px] font-bold text-[#0B0F14] flex items-center justify-center shrink-0`}>
                                                                        {name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                    <span className="text-xs text-[#9AA4AF]">{name} {(hasFundPayment || paidBy.length > 1) ? `(${formatCurrency(amount)})` : ''}</span>
                                                                </span>
                                                            ))}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Amount + delete */}
                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <span className="text-lg font-black text-[#F8FAFC]">{formatCurrency(expense.amount)}</span>
                                            <button
                                                onClick={() => { if (window.confirm(`Delete "${expense.title}"?`)) removeExpense(expense.id); }}
                                                className="text-[#64748B] hover:text-[#FF4757] p-1.5 rounded-lg hover:bg-[#FF4757]/10 transition-all bg-white/5"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            )}
        </div>
    );
};
