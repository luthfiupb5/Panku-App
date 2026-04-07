import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SplitterEvent, Member, Expense, FundDeposit, Transaction } from '../types';

interface AppContextType {
    events: SplitterEvent[];
    contacts: Member[];
    activeEventId: string | null;
    currentEvent: SplitterEvent | null;
    createEvent: (name: string, date: string, members?: Member[], mode?: 'normal' | 'fund') => void;
    setActiveEvent: (id: string | null) => void;
    deleteEvent: (id: string) => void;
    clearAllEvents: () => void;
    addMember: (member: Member) => void;
    removeMember: (memberId: string) => void;
    addExpense: (expense: Expense) => void;
    removeExpense: (expenseId: string) => void;
    addFundDeposit: (deposit: Omit<FundDeposit, 'id'>) => void;
    removeFundDeposit: (depositId: string) => void;
    updateMember: (memberId: string, updates: Partial<Member>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
    markTransactionPaid: (transactionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'panku_events_v2';
const ACTIVE_KEY = 'panku_active_event';
const CONTACTS_KEY = 'panku_contacts_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<SplitterEvent[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [contacts, setContacts] = useState<Member[]>(() => {
        try {
            const saved = localStorage.getItem(CONTACTS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [activeEventId, setActiveEventIdState] = useState<string | null>(() => {
        try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
    });

    // Persist
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    }, [contacts]);

    useEffect(() => {
        if (activeEventId) {
            localStorage.setItem(ACTIVE_KEY, activeEventId);
        } else {
            localStorage.removeItem(ACTIVE_KEY);
        }
    }, [activeEventId]);

    const currentEvent = events.find(e => e.id === activeEventId) ?? null;

    const createEvent = (name: string, date: string, initialMembers: Member[] = [], mode: 'normal' | 'fund' = 'normal') => {
        const newEvent: SplitterEvent = {
            id: crypto.randomUUID(),
            name,
            date,
            members: initialMembers,
            expenses: [],
            mode,
            fundDeposits: mode === 'fund' ? [] : undefined,
            transactions: []
        };
        setEvents(prev => [newEvent, ...prev]);
        setActiveEventIdState(newEvent.id);
    };

    const setActiveEvent = (id: string | null) => {
        setActiveEventIdState(id);
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        if (activeEventId === id) setActiveEventIdState(null);
    };

    const clearAllEvents = () => {
        setEvents([]);
        setActiveEventIdState(null);
    };

    const upsertContact = (name: string, upi_id?: string) => {
        setContacts(prev => {
            const existing = prev.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (existing) {
                if (upi_id && existing.upi_id !== upi_id) {
                    return prev.map(c => c.id === existing.id ? { ...c, upi_id } : c);
                }
                return prev;
            }
            return [...prev, { id: crypto.randomUUID(), name, upi_id }];
        });
    };

    const addMember = (member: Member) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId ? { ...e, members: [...e.members, member] } : e
        ));
        upsertContact(member.name, member.upi_id);
    };

    const removeMember = (memberId: string) => {
        setEvents(prev => prev.map(e =>
            e.id !== activeEventId ? e : {
                ...e,
                members: e.members.filter(m => m.id !== memberId),
                expenses: e.expenses.map(exp => ({
                    ...exp,
                    participants: exp.participants.filter(id => id !== memberId),
                    paidBy: exp.paidBy.filter(p => p.memberId !== memberId)
                }))
            }
        ));
    };

    const updateMember = (memberId: string, updates: Partial<Member>) => {
        setEvents(prev => prev.map(e => {
            if (e.id !== activeEventId) return e;
            const updatedMembers = e.members.map(m => {
                if (m.id === memberId) {
                    const updated = { ...m, ...updates };
                    upsertContact(updated.name, updated.upi_id);
                    return updated;
                }
                return m;
            });
            return { ...e, members: updatedMembers };
        }));
    };

    const addExpense = (expense: Expense) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId ? { ...e, expenses: [...e.expenses, expense] } : e
        ));
    };

    const removeExpense = (expenseId: string) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId
                ? { ...e, expenses: e.expenses.filter(ex => ex.id !== expenseId) }
                : e
        ));
    };

    const addFundDeposit = (deposit: Omit<FundDeposit, 'id'>) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId && e.mode === 'fund'
                ? { ...e, fundDeposits: [...(e.fundDeposits || []), { ...deposit, id: crypto.randomUUID() }] }
                : e
        ));
    };

    const removeFundDeposit = (depositId: string) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId && e.mode === 'fund'
                ? { ...e, fundDeposits: (e.fundDeposits || []).filter(d => d.id !== depositId) }
                : e
        ));
    };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
        };
        setEvents(prev => prev.map(e =>
            e.id === activeEventId
                ? { ...e, transactions: [...(e.transactions || []), newTransaction] }
                : e
        ));
    };

    const markTransactionPaid = (transactionId: string) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId
                ? {
                    ...e,
                    transactions: (e.transactions || []).map(t =>
                        t.id === transactionId ? { ...t, status: 'paid' } : t
                    )
                }
                : e
        ));
    };

    return (
        <AppContext.Provider value={{
            events,
            contacts,
            activeEventId,
            currentEvent,
            createEvent,
            setActiveEvent,
            deleteEvent,
            clearAllEvents,
            addMember,
            removeMember,
            addExpense,
            removeExpense,
            addFundDeposit,
            removeFundDeposit,
            updateMember,
            addTransaction,
            markTransactionPaid,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
