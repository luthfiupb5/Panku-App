import type { SplitterEvent, Settlement, MemberBalance } from '../types';

export const calculateBalances = (event: SplitterEvent): MemberBalance[] => {
    const balances: Record<string, MemberBalance> = {};

    event.members.forEach(member => {
        balances[member.id] = {
            memberId: member.id,
            totalPaid: 0,
            totalShare: 0,
            balance: 0,
        };
    });

    if (event.mode === 'fund') {
        const deposits = event.fundDeposits || [];
        deposits.forEach(deposit => {
            if (balances[deposit.memberId]) {
                balances[deposit.memberId].totalPaid += deposit.amount;
            }
        });
    }

    event.expenses.forEach(expense => {
        // Add totalPaid
        expense.paidBy.forEach(payment => {
            if (balances[payment.memberId]) {
                balances[payment.memberId].totalPaid += payment.amount;
            }
        });

        // Add totalShare
        if (expense.participants.length > 0) {
            const shareAmount = expense.amount / expense.participants.length;
            expense.participants.forEach(participantId => {
                if (balances[participantId]) {
                    balances[participantId].totalShare += shareAmount;
                }
            });
        }
    });

    // Calculate final balances
    const result = Object.values(balances).map(b => {
        // Round to 2 decimal places to avoid floating point issues
        const balance = Math.round((b.totalPaid - b.totalShare) * 100) / 100;
        return {
            ...b,
            totalPaid: Math.round(b.totalPaid * 100) / 100,
            totalShare: Math.round(b.totalShare * 100) / 100,
            balance
        };
    });

    return result;
};

export const calculateSettlements = (balances: MemberBalance[]): Settlement[] => {
    const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }));
    const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b }));

    // Sort descending by absolute balance
    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

    const settlements: Settlement[] = [];

    let i = 0; // debtors index
    let j = 0; // creditors index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
        const roundedAmount = Math.round(amount * 100) / 100;

        if (roundedAmount > 0) {
            settlements.push({
                from: debtor.memberId,
                to: creditor.memberId,
                amount: roundedAmount,
            });
        }

        debtor.balance += amount; // debtor balance approaches 0
        creditor.balance -= amount;

        // Advance pointers if settled
        if (Math.abs(debtor.balance) < 0.01) i++;
        if (creditor.balance < 0.01) j++;
    }

    return settlements;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};
