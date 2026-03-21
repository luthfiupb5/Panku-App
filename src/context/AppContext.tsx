import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SplitterEvent, Member, Expense, FundDeposit } from '../types';

interface AppContextType {
    events: SplitterEvent[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'panku_events_v2';
const ACTIVE_KEY = 'panku_active_event';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<SplitterEvent[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
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
            fundDeposits: mode === 'fund' ? [] : undefined
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

    const addMember = (member: Member) => {
        setEvents(prev => prev.map(e =>
            e.id === activeEventId ? { ...e, members: [...e.members, member] } : e
        ));
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

    return (
        <AppContext.Provider value={{
            events,
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
