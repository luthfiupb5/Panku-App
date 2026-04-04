import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateBalances, calculateSettlements, formatCurrency } from '../utils/calculations';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CheckCircle2, ShieldAlert, Share2 } from 'lucide-react';
import type { Settlement } from '../types';

interface SettlementModalProps {
    onClose: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ onClose }) => {
    const { currentEvent, addTransaction, updateMember } = useAppContext();
    const [copied, setCopied] = useState(false);
    
    // Inline UPI editing state
    const [editingUpiFor, setEditingUpiFor] = useState<string | null>(null);
    const [tempUpi, setTempUpi] = useState('');

    const { settlements, membersDict } = useMemo(() => {
        if (!currentEvent) return { settlements: [], membersDict: {} };
        const balances = calculateBalances(currentEvent);
        const calculatedSettlements = calculateSettlements(balances);
        
        const dict: Record<string, typeof currentEvent.members[0]> = {};
        currentEvent.members.forEach(m => dict[m.id] = m);
        
        return { settlements: calculatedSettlements, membersDict: dict };
    }, [currentEvent]);

    if (!currentEvent) return null;

    // Group by Payer
    const groupedByPayer = settlements.reduce((acc, settlement) => {
        if (!acc[settlement.from]) acc[settlement.from] = [];
        acc[settlement.from].push(settlement);
        return acc;
    }, {} as Record<string, Settlement[]>);

    const handleMarkPaid = (s: Settlement) => {
        addTransaction({
            from_member_id: s.from,
            to_member_id: s.to,
            amount: s.amount,
            status: 'paid'
        });
    };

    const handleSaveUpi = (memberId: string) => {
        if (tempUpi.trim()) {
            updateMember(memberId, { upi_id: tempUpi.trim() });
        }
        setEditingUpiFor(null);
        setTempUpi('');
    };

    const handleShare = async (payerId?: string) => {
        let text = `💳 ${currentEvent.name} Settlement\n\n`;
        const filesArray: File[] = [];

        const processPayments = async (payer: string, payments: Settlement[]) => {
            const payerName = membersDict[payer]?.name || 'Unknown';
            let pText = `${payerName}, you need to pay:\n`;
            
            for (let idx = 0; idx < payments.length; idx++) {
                const p = payments[idx];
                const receiver = membersDict[p.to];
                pText += `${idx + 1}. ${formatCurrency(p.amount)} to ${receiver?.name || 'Unknown'}\n`;
                if (receiver?.upi_id) {
                    pText += `   UPI: ${receiver.upi_id}\n\n`;
                    
                    const canvas = document.getElementById(`qr-${payer}-${p.to}`) as HTMLCanvasElement | null;
                    if (canvas) {
                        try {
                            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                            if (blob) {
                                filesArray.push(new File([blob], `QR_${receiver.name}_${p.amount}.png`, { type: 'image/png' }));
                            }
                        } catch (e) { console.error(e); }
                    }
                } else {
                    pText += `   (Ask for UPI or pay cash)\n\n`;
                }
            }
            return pText;
        };

        if (payerId && groupedByPayer[payerId]) {
            text += await processPayments(payerId, groupedByPayer[payerId]);
        } else {
            for (const [payer, payments] of Object.entries(groupedByPayer)) {
                text += await processPayments(payer, payments) + '\n';
            }
        }
        
        text = text.trim();

        try {
            if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                await navigator.share({
                    title: `${currentEvent.name} Settlement`,
                    text: text,
                    files: filesArray.length > 0 ? filesArray : undefined
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: `${currentEvent.name} Settlement`,
                    text: text
                });
            } else {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (e) {
            console.error('Error sharing', e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#05080C]/95 backdrop-blur-md overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0A1C28]/80">
                <div>
                    <h2 className="text-xl font-black text-[#E8EDF2] flex items-center gap-2">
                        <QrCode size={20} className="text-[#33DBC5]" />
                        Settle Payments
                    </h2>
                    <p className="text-[#9AA4AF] text-xs mt-0.5">Generate UPI QRs and distribute.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handleShare()} className="text-[#33DBC5] bg-[#33DBC5]/10 p-2.5 rounded-full hover:bg-[#33DBC5]/20 transition-all flex items-center gap-2">
                        {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                    </button>
                    <button onClick={onClose} className="text-[#9AA4AF] bg-white/5 p-2.5 rounded-full hover:text-white transition-all">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
                {Object.keys(groupedByPayer).length === 0 ? (
                    <div className="panku-card py-16 text-center border-dashed border-2 border-white/10 bg-[#0A1C28]/50">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#38F2C2]/10 flex items-center justify-center text-[#38F2C2] mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="font-bold text-[#E8EDF2] text-lg">All Settled Up!</h3>
                        <p className="text-[#9AA4AF] text-sm mt-1">No pending payments remaining.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {Object.entries(groupedByPayer).map(([payerId, payments]) => {
                            const payerName = membersDict[payerId]?.name || 'Unknown';
                            return (
                                <motion.div 
                                    key={payerId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="panku-card overflow-hidden"
                                >
                                    <div className="p-4 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                                        <h3 className="font-extrabold text-[#E8EDF2] flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{payerName[0]?.toUpperCase()}</div>
                                            {payerName}'s Payments
                                        </h3>
                                        <button onClick={() => handleShare(payerId)} className="text-[#9AA4AF] hover:text-[#38F2C2] bg-white/5 hover:bg-[#38F2C2]/10 p-2.5 rounded-full transition-all flex items-center gap-2 text-xs font-bold">
                                            <Share2 size={16} /> Share
                                        </button>
                                    </div>
                                    <div className="divide-y divide-white/[0.04]">
                                        {payments.map((p, idx) => {
                                            const receiver = membersDict[p.to];
                                            const upiId = receiver?.upi_id;
                                            const upiLink = upiId ? `upi://pay?pa=${upiId}&pn=${receiver.name}&am=${p.amount}&cu=INR` : null;

                                            return (
                                                <div key={idx} className="p-5 flex flex-col items-center sm:flex-row sm:items-start gap-5">
                                                    {/* QR Code Segment */}
                                                    <div className="shrink-0 p-3 bg-white rounded-2xl shadow-lg relative">
                                                        {upiLink ? (
                                                            <QRCodeCanvas id={`qr-${payerId}-${p.to}`} value={upiLink} size={110} level="M" />
                                                        ) : (
                                                            <div className="w-[110px] h-[110px] bg-gray-100 flex flex-col items-center justify-center text-gray-400 rounded-xl border-2 border-dashed border-gray-300">
                                                                <ShieldAlert size={28} className="mb-2" />
                                                                <span className="text-[10px] font-bold text-center px-2">NO UPI ID</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Details Segment */}
                                                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                                                        <p className="text-[#9AA4AF] text-sm font-medium">Pay to <span className="text-[#E8EDF2] font-bold">{receiver?.name || 'Unknown'}</span></p>
                                                        <p className="text-3xl font-black text-[#38F2C2] my-1">{formatCurrency(p.amount)}</p>
                                                        
                                                        {upiId ? (
                                                            <p className="text-[#33DBC5] text-xs font-medium bg-[#33DBC5]/10 px-2.5 py-1 rounded-lg mt-1 tracking-wide">{upiId}</p>
                                                        ) : editingUpiFor === `${payerId}_${p.to}` ? (
                                                            <div className="mt-2 flex gap-2 w-full sm:max-w-[200px]">
                                                                <input 
                                                                    autoFocus
                                                                    className="panku-input py-1.5 px-3 text-xs w-full border-[#EF4444]/30 focus:border-[#EF4444]/60 bg-[#EF4444]/5"
                                                                    placeholder="e.g. name@upi"
                                                                    value={tempUpi}
                                                                    onChange={e => setTempUpi(e.target.value)}
                                                                />
                                                                <button 
                                                                    onClick={() => handleSaveUpi(p.to)}
                                                                    disabled={!tempUpi.trim()}
                                                                    className="bg-[#EF4444] text-white px-3 rounded-lg text-xs font-bold disabled:opacity-50"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => { setEditingUpiFor(`${payerId}_${p.to}`); setTempUpi(''); }}
                                                                className="text-[#EF4444] text-[11px] font-bold bg-[#EF4444]/10 hover:bg-[#EF4444]/20 px-2.5 py-1.5 rounded-lg mt-1 flex items-center gap-1 transition-colors"
                                                            >
                                                                <ShieldAlert size={12} /> Add UPI ID
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => handleMarkPaid(p)}
                                                            className="mt-4 sm:max-w-[150px] w-full py-2.5 bg-white/5 hover:bg-[#38F2C2]/20 border border-white/10 hover:border-[#38F2C2]/40 text-[#E8EDF2] hover:text-[#38F2C2] rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
                                                        >
                                                            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /> Mark as Paid
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
