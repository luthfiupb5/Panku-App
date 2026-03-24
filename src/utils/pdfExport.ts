import { jsPDF } from 'jspdf';
import type { SplitterEvent } from '../types';
import { calculateBalances, calculateSettlements } from './calculations';

const formatForPDF = (amount: number): string => {
    return 'Rs. ' + amount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};

export const generatePDF = async (event: SplitterEvent) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;

        // Custom Colors
        const primaryText = '#0B0F14';
        const secondaryText = '#66707A';
        const accent = '#2DD4BF'; // Brand Teal

        // Helper function for adding text
        const addText = (text: string, x: number, y: number, size: number, color: string, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
            pdf.setFontSize(size);
            pdf.setTextColor(color);
            pdf.text(text, x, y, { align });
        };

        // --- Header Section ---
        let currentY = 25;
        
        // Add Logo — preserves exact aspect ratio by measuring natural image dimensions
        const logoUrl = '/Assets/logo-lightbg.png';
        let logoLoaded = false;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(logoUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                const dataUrl = await new Promise<string | null>((resolve) => {
                    reader.onloadend = () => {
                        const result = reader.result;
                        resolve(typeof result === 'string' && result.startsWith('data:image') ? result : null);
                    };
                    reader.onerror = () => resolve(null);
                });

                if (dataUrl) {
                    // Measure natural dimensions to preserve aspect ratio
                    const { w, h } = await new Promise<{ w: number; h: number }>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
                        img.onerror = () => resolve({ w: 1, h: 1 });
                        img.src = dataUrl;
                    });

                    // Scale uniformly: fix height at 12mm, compute width from aspect ratio
                    const targetH = 12;
                    const targetW = (w / h) * targetH;

                    try {
                        pdf.addImage(dataUrl, 'PNG', margin, currentY - 10, targetW, targetH);
                        logoLoaded = true;
                    } catch (_) {
                        // addImage failed — fall back to text
                    }
                }
            }
        } catch (_) {
            // fetch aborted or failed — fallback to text only
        }

        // Only render text fallback if logo couldn't be loaded
        if (!logoLoaded) {
            addText('Panku.', margin, currentY, 24, accent, true);
        }
        currentY += 15;
        addText('Expense Settlement Report', margin, currentY, 18, primaryText, true);
        
        currentY += 8;
        addText(`Event: ${event.name}`, margin, currentY, 11, secondaryText);
        
        const eventDate = new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        addText(`Date: ${eventDate}`, margin, currentY + 6, 11, secondaryText);

        currentY += 16;
        pdf.setDrawColor(accent);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);

        // --- Mathematical Logic ---
        const balances = calculateBalances(event);
        const totalExp = event.expenses.reduce((s, e) => s + e.amount, 0);
        
        const isFundMode = event.mode === 'fund';
        const tFund = isFundMode ? (event.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
        const tSpentFromFund = isFundMode ? event.expenses.reduce((s, e) => {
            if (e.poolUsed !== undefined) return s + e.poolUsed;
            const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
            return s + (e.amount - membersPaid);
        }, 0) : 0;
        const rFund = Math.max(0, tFund - tSpentFromFund);

        let balanceList = [...balances];
        
        const settlements = calculateSettlements(balanceList);
        
        const getMemberName = (id: string) => {
            return event.members.find(m => m.id === id)?.name ?? 'Unknown';
        };

        // --- Summary Stats ---
        currentY += 15;
        
        if (isFundMode) {
            addText('Trip Pool Summary', margin, currentY, 14, primaryText, true);
            currentY += 8;
            addText('Initial Pool:', margin, currentY, 11, secondaryText);
            addText(formatForPDF(tFund), margin + 40, currentY, 11, primaryText, true);

            currentY += 7;
            addText('Spent from Pool:', margin, currentY, 11, secondaryText);
            addText(formatForPDF(tSpentFromFund), margin + 40, currentY, 11, '#EF4444', true);

            currentY += 7;
            addText('Remaining Pool:', margin, currentY, 11, secondaryText);
            addText(formatForPDF(rFund), margin + 40, currentY, 11, accent, true);
            
            currentY += 12;
            pdf.setDrawColor('#E8EDF2');
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 15;
        }

        addText('Event Summary', margin, currentY, 14, primaryText, true);
        currentY += 8;
        addText('Total Event Cost:', margin, currentY, 11, secondaryText);
        addText(formatForPDF(totalExp), margin + 40, currentY, 11, primaryText, true);
        
        currentY += 7;
        addText('Members count:', margin, currentY, 11, secondaryText);
        addText(event.members.length.toString(), margin + 40, currentY, 11, primaryText, true);

        currentY += 7;
        addText('Expenses count:', margin, currentY, 11, secondaryText);
        addText(event.expenses.length.toString(), margin + 40, currentY, 11, primaryText, true);

        currentY += 12;
        pdf.setDrawColor('#E8EDF2');
        pdf.line(margin, currentY, pageWidth - margin, currentY);

        // --- Member Balances ---
        currentY += 15;
        addText('Member Balances', margin, currentY, 14, primaryText, true);
        currentY += 10;

        balances.forEach((b) => {
            const name = getMemberName(b.memberId);
            const balanceText = formatForPDF(Math.abs(b.balance));
            const isPositive = b.balance >= 0;
            const balanceColor = isPositive ? '#10B981' : '#EF4444';
            const sign = isPositive ? '+' : '-';

            addText(name, margin, currentY, 11, primaryText, true);
            addText(`Paid: ${formatForPDF(b.totalPaid)}  |  Share: ${formatForPDF(b.totalShare)}`, margin, currentY + 5, 9, secondaryText);
            
            // Draw a pill background for the balance
            const fullBalanceText = `${sign}${balanceText}`;
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            const bTextW = pdf.getStringUnitWidth(fullBalanceText) * 11 / pdf.internal.scaleFactor;
            const bPillW = bTextW + 8;
            const bPillH = 7;
            const bPillX = pageWidth - margin - bPillW;
            const bPillY = currentY - 5;
            
            // Approximate light background colors for positive/negative
            pdf.setFillColor(isPositive ? '#E6F8EF' : '#FDECEE');
            pdf.roundedRect(bPillX, bPillY, bPillW, bPillH, 1.5, 1.5, 'F');
            
            addText(fullBalanceText, pageWidth - margin - 4, currentY, 11, balanceColor, true, 'right');
            
            currentY += 14;

            if (currentY > pdf.internal.pageSize.getHeight() - 30) {
                pdf.addPage();
                currentY = margin + 10;
            }
        });

        // --- Settlements (Who pays whom) ---
        currentY += 10;
        pdf.setDrawColor('#E8EDF2');
        pdf.line(margin, currentY, pageWidth - margin, currentY);

        currentY += 15;
        addText('Settlements (Who pays whom)', margin, currentY, 14, primaryText, true);
        currentY += 10;

        if (settlements.length === 0) {
            addText('All balances are settled! No payments needed.', margin, currentY, 11, accent, true);
        } else {
            settlements.forEach((s) => {
                const fromName = getMemberName(s.from);
                const toName = getMemberName(s.to);
                const isFromFund = s.from === 'FUND_BOX';
                const isToFund = s.to === 'FUND_BOX';
                
                // Get width of name in mm to calculate X position
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                const fromWidth = pdf.getStringUnitWidth(fromName) * 11 / pdf.internal.scaleFactor;
                
                addText(fromName, margin, currentY, 11, isFromFund ? accent : primaryText, true);
                
                // Draw a nice "PAYS" badge instead of an arrow
                const badgeText = "PAYS";
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'bold');
                const badgeTextWidth = pdf.getStringUnitWidth(badgeText) * 7 / pdf.internal.scaleFactor;
                const badgeWidth = badgeTextWidth + 4;
                const badgeHeight = 4.5;
                const badgeX = margin + fromWidth + 3;
                const badgeY = currentY - 3;
                
                pdf.setFillColor(accent); // Teal background
                pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1, 1, 'F');
                addText(badgeText, badgeX + 2, currentY + 0.3, 7, '#FFFFFF', true);
                
                const toNameX = badgeX + badgeWidth + 3;
                addText(toName, toNameX, currentY, 11, isToFund ? accent : primaryText, true);
                
                addText(formatForPDF(s.amount), pageWidth - margin, currentY, 12, primaryText, true, 'right');
                
                currentY += 10;

                if (currentY > pdf.internal.pageSize.getHeight() - 30) {
                    pdf.addPage();
                    currentY = margin + 10;
                }
            });
        }

        // --- Footer ---
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            addText(`Generated by Panku App | Split Expenses, Not Friendships - Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, 8, secondaryText, false, 'center');
        }

        // Save PDF
        const filename = `${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_Settlement.pdf`;
        pdf.save(filename);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
