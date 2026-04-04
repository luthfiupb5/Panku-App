export interface Member {
    id: string;
    name: string;
    upi_id?: string;
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

export interface Transaction {
    id: string;
    from_member_id: string;
    to_member_id: string;
    amount: number;
    status: 'pending' | 'paid';
    timestamp: string;
}

export interface SplitterEvent {
    id: string;
    name: string;
    date: string;
    members: Member[];
    expenses: Expense[];
    mode?: 'normal' | 'fund';
    fundDeposits?: FundDeposit[];
    transactions?: Transaction[];
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
