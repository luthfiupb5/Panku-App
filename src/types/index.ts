export interface Member {
    id: string;
    name: string;
}

export interface PaymentContribution {
    memberId: string;
    amount: number;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    poolUsed?: number;
    paidBy: PaymentContribution[];
    participants: string[]; // memberIds
}

export interface FundDeposit {
    id: string;
    memberId: string;
    amount: number;
    date: string;
}

export interface SplitterEvent {
    id: string;
    name: string;
    date: string;
    members: Member[];
    expenses: Expense[];
    mode?: 'normal' | 'fund';
    fundDeposits?: FundDeposit[];
}

export interface Settlement {
    from: string; // memberId
    to: string; // memberId
    amount: number;
}

export interface MemberBalance {
    memberId: string;
    totalPaid: number;
    totalShare: number;
    balance: number;
}
