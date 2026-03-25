import { ViteReactSSG } from "vite-react-ssg";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CalendarDays, Receipt, Plus, Calendar, Trash2, Users, ArrowRight, X, UserPlus, Check, Banknote, Utensils, Plane, CarTaxiFront, ShoppingCart, Hotel, Coffee, Film, PartyPopper, Beer, Fuel, Pill, Home, BarChart3, TrendingUp, CheckCircle2, Download, PieChart, IndianRupee, Wallet } from "lucide-react";
import { jsPDF } from "jspdf";
import { ResponsiveContainer, PieChart as PieChart$1, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from "recharts";
import { Outlet, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const AppContext = createContext(void 0);
const STORAGE_KEY = "panku_events_v2";
const ACTIVE_KEY = "panku_active_event";
const AppProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeEventId, setActiveEventIdState] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_KEY);
    } catch {
      return null;
    }
  });
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
  const currentEvent = events.find((e) => e.id === activeEventId) ?? null;
  const createEvent = (name, date, initialMembers = [], mode = "normal") => {
    const newEvent = {
      id: crypto.randomUUID(),
      name,
      date,
      members: initialMembers,
      expenses: [],
      mode,
      fundDeposits: mode === "fund" ? [] : void 0
    };
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventIdState(newEvent.id);
  };
  const setActiveEvent = (id) => {
    setActiveEventIdState(id);
  };
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (activeEventId === id) setActiveEventIdState(null);
  };
  const clearAllEvents = () => {
    setEvents([]);
    setActiveEventIdState(null);
  };
  const addMember = (member) => {
    setEvents((prev) => prev.map(
      (e) => e.id === activeEventId ? { ...e, members: [...e.members, member] } : e
    ));
  };
  const removeMember = (memberId) => {
    setEvents((prev) => prev.map(
      (e) => e.id !== activeEventId ? e : {
        ...e,
        members: e.members.filter((m) => m.id !== memberId),
        expenses: e.expenses.map((exp) => ({
          ...exp,
          participants: exp.participants.filter((id) => id !== memberId),
          paidBy: exp.paidBy.filter((p) => p.memberId !== memberId)
        }))
      }
    ));
  };
  const addExpense = (expense) => {
    setEvents((prev) => prev.map(
      (e) => e.id === activeEventId ? { ...e, expenses: [...e.expenses, expense] } : e
    ));
  };
  const removeExpense = (expenseId) => {
    setEvents((prev) => prev.map(
      (e) => e.id === activeEventId ? { ...e, expenses: e.expenses.filter((ex) => ex.id !== expenseId) } : e
    ));
  };
  const addFundDeposit = (deposit) => {
    setEvents((prev) => prev.map(
      (e) => e.id === activeEventId && e.mode === "fund" ? { ...e, fundDeposits: [...e.fundDeposits || [], { ...deposit, id: crypto.randomUUID() }] } : e
    ));
  };
  const removeFundDeposit = (depositId) => {
    setEvents((prev) => prev.map(
      (e) => e.id === activeEventId && e.mode === "fund" ? { ...e, fundDeposits: (e.fundDeposits || []).filter((d) => d.id !== depositId) } : e
    ));
  };
  return /* @__PURE__ */ jsx(AppContext.Provider, { value: {
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
    removeFundDeposit
  }, children });
};
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
const logoDarkBg = "/assets/logo-darkbg-DEWQa8nl.png";
const Header = () => {
  const { currentEvent, setActiveEvent } = useAppContext();
  return /* @__PURE__ */ jsx(
    "header",
    {
      className: "sticky top-0 z-50 w-full border-b border-white/[0.03]",
      style: {
        backgroundColor: "rgba(5, 8, 12, 0.65)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 h-16 flex items-center justify-between", children: [
        currentEvent ? /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveEvent(null),
            className: "flex items-center gap-1.5 text-[#9AA4AF] hover:text-[#2DD4BF] transition-colors group",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { size: 18, className: "group-hover:-translate-x-0.5 transition-transform" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Events" })
            ]
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("img", { src: logoDarkBg, alt: "Panku Logo", className: "h-8 object-contain drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]" }) }),
        currentEvent && /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            className: "flex items-center gap-2 panku-card-inner px-3 py-1.5 max-w-[50%]",
            style: { borderRadius: "10px" },
            children: [
              /* @__PURE__ */ jsx(CalendarDays, { size: 12, className: "text-[#2DD4BF] shrink-0" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#E8EDF2] text-xs truncate", children: currentEvent.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#66707A]", children: new Date(currentEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) })
              ] })
            ]
          }
        ),
        currentEvent && /* @__PURE__ */ jsx("img", { src: logoDarkBg, alt: "Panku Logo", className: "h-6 object-contain" })
      ] })
    }
  );
};
const calculateBalances = (event) => {
  const balances = {};
  event.members.forEach((member) => {
    balances[member.id] = {
      memberId: member.id,
      totalPaid: 0,
      totalShare: 0,
      balance: 0
    };
  });
  if (event.mode === "fund") {
    const deposits = event.fundDeposits || [];
    deposits.forEach((deposit) => {
      if (balances[deposit.memberId]) {
        balances[deposit.memberId].totalPaid += deposit.amount;
      }
    });
  }
  event.expenses.forEach((expense) => {
    expense.paidBy.forEach((payment) => {
      if (balances[payment.memberId]) {
        balances[payment.memberId].totalPaid += payment.amount;
      }
    });
    if (expense.participants.length > 0) {
      const shareAmount = expense.amount / expense.participants.length;
      expense.participants.forEach((participantId) => {
        if (balances[participantId]) {
          balances[participantId].totalShare += shareAmount;
        }
      });
    }
  });
  const result = Object.values(balances).map((b) => {
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
const calculateSettlements = (balances) => {
  const creditors = balances.filter((b) => b.balance > 0.01).map((b) => ({ ...b }));
  const debtors = balances.filter((b) => b.balance < -0.01).map((b) => ({ ...b }));
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  const settlements = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
    const roundedAmount = Math.round(amount * 100) / 100;
    if (roundedAmount > 0) {
      settlements.push({
        from: debtor.memberId,
        to: creditor.memberId,
        amount: roundedAmount
      });
    }
    debtor.balance += amount;
    creditor.balance -= amount;
    if (Math.abs(debtor.balance) < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }
  return settlements;
};
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};
const CreateEventModal = ({ onClose }) => {
  const { createEvent } = useAppContext();
  const [name, setName] = useState("");
  const [date, setDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [mode, setMode] = useState("normal");
  const addMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers((prev) => [...prev, trimmed]);
      setMemberInput("");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const memberObjects = members.map((m) => ({ id: crypto.randomUUID(), name: m }));
    createEvent(name.trim(), date, memberObjects, mode);
    onClose();
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4",
      style: { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" },
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 60, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 40, scale: 0.96 },
          transition: { type: "spring", stiffness: 300, damping: 26 },
          className: "w-full max-w-md panku-card overflow-hidden",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 w-full bg-teal-gradient" }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#E8EDF2]", children: "Create New Event" }),
                /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-[#66707A] hover:text-[#E8EDF2] p-1.5 rounded-lg hover:bg-white/5 transition-all", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2", children: "Event Name" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "panku-input",
                      required: true,
                      placeholder: "e.g. Goa Trip, Office Lunch",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      autoFocus: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2", children: "Date" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      className: "panku-input",
                      value: date,
                      onChange: (e) => setDate(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2", children: "Add Members (optional)" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        className: "panku-input flex-1",
                        placeholder: "Enter name and press +",
                        value: memberInput,
                        onChange: (e) => setMemberInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addMember();
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: addMember,
                        className: "w-11 h-11 rounded-xl flex items-center justify-center btn-teal text-[#030609] font-bold shrink-0",
                        children: /* @__PURE__ */ jsx(Plus, { size: 20 })
                      }
                    )
                  ] }),
                  members.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: members.map((m) => /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-[#030609] bg-teal-gradient",
                      children: [
                        m,
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setMembers((prev) => prev.filter((x) => x !== m)),
                            className: "text-[#030609]/60 hover:text-[#030609] transition-colors",
                            children: /* @__PURE__ */ jsx(X, { size: 12 })
                          }
                        )
                      ]
                    },
                    m
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-3", children: "Expense Mode" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-3 rounded-[14px] border ${mode === "normal" ? "border-[#2DD4BF] bg-[#2DD4BF]/10" : "border-white/10 opacity-70"} cursor-pointer transition-all`, children: [
                      /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx("input", { type: "radio", name: "mode", value: "normal", checked: mode === "normal", onChange: () => setMode("normal"), className: "accent-[#2DD4BF] w-4 h-4" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: `font-bold text-sm ${mode === "normal" ? "text-[#2DD4BF]" : "text-[#E8EDF2]"}`, children: "Split Expenses Normally" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#9AA4AF] mt-0.5", children: "Current system. Add expenses and select who paid." })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-3 rounded-[14px] border ${mode === "fund" ? "border-[#2DD4BF] bg-[#2DD4BF]/10" : "border-white/10 opacity-70"} cursor-pointer transition-all`, children: [
                      /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx("input", { type: "radio", name: "mode", value: "fund", checked: mode === "fund", onChange: () => setMode("fund"), className: "accent-[#2DD4BF] w-4 h-4" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("p", { className: `font-bold text-sm ${mode === "fund" ? "text-[#2DD4BF]" : "text-[#E8EDF2]"}`, children: [
                          "Use Trip Pool ",
                          /* @__PURE__ */ jsx("span", { className: "opacity-70", children: "(Initial Deposit)" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#9AA4AF] mt-0.5", children: "Everyone contributes money to a common pool. Expenses are paid from that pool." })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { type: "submit", className: "btn-teal w-full py-4 text-base font-bold", children: "Create Event" })
              ] })
            ] })
          ]
        }
      )
    }
  );
};
const HomeScreen = () => {
  const { events, setActiveEvent, deleteEvent } = useAppContext();
  const [showCreate, setShowCreate] = useState(false);
  const getTotalExpense = (event) => event.expenses.reduce((sum, e) => sum + e.amount, 0);
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-5 pt-8 pb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2.5 mb-6", children: /* @__PURE__ */ jsx("img", { src: logoDarkBg, alt: "Panku Logo", className: "h-10 object-contain drop-shadow-[0_0_20px_rgba(45,212,191,0.3)]" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-1", children: "Welcome back" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-extrabold text-[#E8EDF2] leading-tight", children: [
        "Split expenses,",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-teal-gradient", children: "stay friends." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 px-5 pt-2 flex flex-col", children: events.length === 0 ? /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "flex-1 flex flex-col items-center justify-center text-center -mt-20",
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 drop-shadow-[0_20px_40px_rgba(45,212,191,0.3)] animate-float text-[#2DD4BF]", children: /* @__PURE__ */ jsx(Receipt, { size: 100, strokeWidth: 1 }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-[#F8FAFC] font-black text-3xl mb-3 tracking-tight", children: "No events yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#94A3B8] text-base mb-10 max-w-[240px]", children: "Create an event to start splitting expenses with friends." }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowCreate(true),
              className: "btn-teal px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(45,212,191,0.4)]",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 24, strokeWidth: 3 }),
                "Create First Event"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-3", children: "Your Events" }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: events.map((event, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, x: -20 },
          transition: { delay: idx * 0.05 },
          className: "panku-card p-5 group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2] text-lg leading-tight", children: event.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 12, className: "text-[#66707A]" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#66707A] text-xs", children: new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete "${event.name}"?`)) deleteEvent(event.id);
                  },
                  className: "text-[#66707A] hover:text-[#FF4757] p-2 rounded-xl hover:bg-[#FF4757]/10 transition-all bg-white/5",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[#9AA4AF] text-sm", children: [
                /* @__PURE__ */ jsx(Users, { size: 14, className: "text-[#2DD4BF]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  event.members.length,
                  " Members"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[#9AA4AF] text-sm", children: [
                /* @__PURE__ */ jsx(Receipt, { size: 14, className: "text-[#2DD4BF]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  event.expenses.length,
                  " Expenses"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[#66707A] text-xs mb-0.5", children: "Total Expense" }),
                /* @__PURE__ */ jsx("p", { className: "text-[#E8EDF2] font-extrabold text-xl", children: formatCurrency(getTotalExpense(event)) })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveEvent(event.id),
                  className: "flex items-center gap-2 text-[#2DD4BF] font-semibold text-sm bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 px-4 py-2 rounded-xl transition-all active:scale-95",
                  children: [
                    "View Details",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                  ]
                }
              )
            ] })
          ]
        },
        event.id
      )) })
    ] }) }),
    events.length > 0 && /* @__PURE__ */ jsx(
      motion.button,
      {
        whileHover: { scale: 1.08 },
        whileTap: { scale: 0.94 },
        onClick: () => setShowCreate(true),
        className: "fab-teal fixed bottom-8 right-6 z-40",
        title: "Create Event",
        children: /* @__PURE__ */ jsx(Plus, { size: 26, strokeWidth: 2.5 })
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsx(CreateEventModal, { onClose: () => setShowCreate(false) }) })
  ] });
};
const AVATAR$4 = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7"];
const getAvatarClass$4 = (name) => AVATAR$4[name.charCodeAt(0) % AVATAR$4.length];
const DashboardScreen = () => {
  const { currentEvent, addMember, removeMember } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  if (!currentEvent) return null;
  const totalEventCost = currentEvent.expenses.reduce((s, e) => s + e.amount, 0);
  const isFundMode = currentEvent.mode === "fund";
  const totalFund = isFundMode ? (currentEvent.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
  const totalSpentFromFund = isFundMode ? currentEvent.expenses.reduce((s, e) => {
    if (e.poolUsed !== void 0) return s + e.poolUsed;
    const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
    return s + (e.amount - membersPaid);
  }, 0) : totalEventCost;
  const remainingFund = Math.max(0, totalFund - totalSpentFromFund);
  const usagePercent = totalFund > 0 ? Math.min(totalSpentFromFund / totalFund * 100, 100) : 0;
  const handleAddMember = (e) => {
    e.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    if (currentEvent.members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Member exists");
      return;
    }
    addMember({ id: crypto.randomUUID(), name: trimmed });
    setNewMemberName("");
    setIsAdding(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-[#E8EDF2]", children: "Dashboard" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[#9AA4AF] text-sm mt-0.5", children: [
        "Overview of ",
        currentEvent.name,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        className: "relative rounded-[24px] p-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" }),
          isFundMode ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2", children: "Trip Pool" }),
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-[#030609] tracking-tight mb-5", children: formatCurrency(totalFund) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4 relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5", children: "Spent" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[#030609] text-lg leading-none", children: formatCurrency(totalSpentFromFund) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5", children: "Remaining" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[#030609] text-lg leading-none", children: formatCurrency(remainingFund) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-[#030609]/10 rounded-full h-1.5 w-full mb-1 relative z-10 overflow-hidden", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { width: 0 },
                animate: { width: `${usagePercent}%` },
                transition: { duration: 1, ease: "easeOut" },
                className: `h-full ${remainingFund < 0 ? "bg-red-500" : "bg-[#030609]"}`
              }
            ) }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[#030609]/70 font-semibold text-right relative z-10", children: [
              usagePercent.toFixed(0),
              "% Used"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-4 border-t border-[#030609]/15 flex items-end justify-between relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5", children: "Total Event Cost" }),
                /* @__PURE__ */ jsx("p", { className: "font-black text-[#030609] text-xl leading-none", children: formatCurrency(totalEventCost) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right text-xs", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70 block mb-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.expenses.length }),
                  " Expenses"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70 block", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.members.length }),
                  " Members"
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2", children: "Total Event Cost" }),
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-[#030609] tracking-tight", children: formatCurrency(totalEventCost) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.expenses.length }),
                " Expenses"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.members.length }),
                " Members"
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2]", children: "Members" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsAdding(!isAdding),
            className: "text-xs text-[#030609] bg-[#2DD4BF] hover:bg-[#14B8A6] px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors",
            children: [
              /* @__PURE__ */ jsx(UserPlus, { size: 14 }),
              " Add"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: isAdding && /* @__PURE__ */ jsxs(
        motion.form,
        {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          exit: { opacity: 0, height: 0 },
          onSubmit: handleAddMember,
          className: "flex gap-2 mb-3 overflow-hidden",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "panku-input flex-1 py-2.5 text-sm",
                placeholder: "Member name...",
                value: newMemberName,
                onChange: (e) => setNewMemberName(e.target.value),
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "btn-teal px-5 py-2.5 rounded-xl font-bold text-sm shrink-0", children: "Save" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "panku-card overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "divide-y divide-white/[0.04]", children: /* @__PURE__ */ jsx(AnimatePresence, { children: currentEvent.members.map((member, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 },
          transition: { delay: i * 0.05 },
          className: "flex items-center justify-between px-4 py-3 group hover:bg-white/[0.02]",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center text-[#030609] font-black text-sm ${getAvatarClass$4(member.name)} shadow-lg`, children: member.name.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[#E8EDF2]", children: member.name })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  if (window.confirm(`Remove ${member.name}?`)) removeMember(member.id);
                },
                className: "text-[#64748B] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/15 p-2 rounded-lg transition-colors flex shrink-0",
                title: "Delete member",
                children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
              }
            )
          ]
        },
        member.id
      )) }) }) })
    ] })
  ] });
};
const AVATAR$3 = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7"];
const getAvatarClass$3 = (name) => AVATAR$3[name.charCodeAt(0) % AVATAR$3.length];
const ExpenseForm = ({ onCancel, onSave }) => {
  var _a;
  const { currentEvent, addExpense } = useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isMultiPayer, setIsMultiPayer] = useState(false);
  const isFundMode = (currentEvent == null ? void 0 : currentEvent.mode) === "fund";
  const availablePool = React.useMemo(() => {
    if (!isFundMode || !currentEvent) return 0;
    const totalFund = (currentEvent.fundDeposits || []).reduce((s, d) => s + d.amount, 0);
    const totalSpent = currentEvent.expenses.reduce((s, e) => {
      if (e.poolUsed !== void 0) return s + e.poolUsed;
      const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
      return s + (e.amount - membersPaid);
    }, 0);
    return Math.max(0, totalFund - totalSpent);
  }, [currentEvent, isFundMode]);
  const [useTripPool, setUseTripPool] = useState(true);
  const [singlePayerId, setSinglePayerId] = useState(((_a = currentEvent == null ? void 0 : currentEvent.members[0]) == null ? void 0 : _a.id) ?? "");
  const [multiPayerAmounts, setMultiPayerAmounts] = useState({});
  const [participants, setParticipants] = useState(
    new Set(currentEvent == null ? void 0 : currentEvent.members.map((m) => m.id))
  );
  const parsedAmount = parseFloat(amount) || 0;
  const poolUsedAmt = isFundMode && useTripPool && availablePool > 0 ? Math.min(parsedAmount, availablePool) : 0;
  const remainingAmt = Math.max(0, Math.round((parsedAmount - poolUsedAmt) * 100) / 100);
  const showRemainingWarning = isFundMode && poolUsedAmt > 0 && remainingAmt > 0;
  useEffect(() => {
    if ((currentEvent == null ? void 0 : currentEvent.members[0]) && !singlePayerId) setSinglePayerId(currentEvent.members[0].id);
  }, [currentEvent, singlePayerId]);
  if (!currentEvent || currentEvent.members.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "panku-card p-5 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-[#FFA502] text-sm", children: "Please add members before adding expenses." }) });
  }
  const toggleParticipant = (id) => {
    const next = new Set(participants);
    next.has(id) ? next.delete(id) : next.add(id);
    setParticipants(next);
  };
  const multiTotal = Object.values(multiPayerAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;
    if (participants.size === 0) {
      alert("Select at least one participant.");
      return;
    }
    const totalAmt = parseFloat(amount);
    let paidBy = [];
    if (remainingAmt > 0) {
      if (isMultiPayer) {
        if (Math.abs(remainingAmt - multiTotal) > 0.01) {
          alert(`Amounts don't match: split ${multiTotal.toFixed(2)} vs remaining ${remainingAmt.toFixed(2)}`);
          return;
        }
        currentEvent.members.forEach((m) => {
          const p = parseFloat(multiPayerAmounts[m.id]);
          if (p > 0) paidBy.push({ memberId: m.id, amount: p });
        });
        if (!paidBy.length) {
          alert("Enter payment amounts.");
          return;
        }
      } else {
        paidBy = [{ memberId: singlePayerId, amount: remainingAmt }];
      }
    }
    addExpense({ id: crypto.randomUUID(), title: title.trim(), amount: totalAmt, poolUsed: poolUsedAmt, paidBy, participants: Array.from(participants) });
    onSave();
  };
  return /* @__PURE__ */ jsxs("div", { className: "panku-card overflow-hidden relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-teal-gradient" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-white/[0.04]", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2] text-lg", children: "Add Expense" }),
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "text-[#66707A] hover:text-[#E8EDF2] p-1.5 rounded-lg hover:bg-white/5 transition-all", children: /* @__PURE__ */ jsx(X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "p-5 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2", children: "Expense Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "panku-input",
            required: true,
            placeholder: "e.g. Dinner, Bus Tickets, Hotel",
            value: title,
            onChange: (e) => setTitle(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#9AA4AF] uppercase tracking-wider mb-2", children: "Amount (₹)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            required: true,
            min: "0.01",
            step: "0.01",
            placeholder: "0.00",
            className: "panku-input font-black text-2xl text-teal-gradient",
            value: amount,
            onChange: (e) => setAmount(e.target.value)
          }
        )
      ] }),
      isFundMode && availablePool > 0 && /* @__PURE__ */ jsxs("div", { className: "panku-card-inner p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#E8EDF2]", children: "Use Trip Pool?" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#2DD4BF] mt-0.5", children: [
            "Available: ₹",
            availablePool.toFixed(2)
          ] }),
          useTripPool && parsedAmount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#9AA4AF] mt-1", children: [
            "Using ",
            /* @__PURE__ */ jsxs("strong", { className: "text-[#E8EDF2]", children: [
              "₹",
              poolUsedAmt.toFixed(2)
            ] }),
            " from pool."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setUseTripPool(!useTripPool),
            className: `w-12 h-6 rounded-full transition-all relative ${useTripPool ? "bg-teal-gradient" : "bg-[#66707A]/40"}`,
            children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-transform ${useTripPool ? "left-7" : "left-1"}` })
          }
        )
      ] }),
      remainingAmt > 0 && /* @__PURE__ */ jsxs("div", { className: showRemainingWarning ? "panku-card-inner p-4 border border-[#FF4757]/20 relative overflow-hidden" : "mb-5", children: [
        showRemainingWarning && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#FF4757]/5 rounded-full blur-2xl pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between ${showRemainingWarning ? "mb-4 relative z-10" : "mb-3"}`, children: [
          showRemainingWarning ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-[#FF4757]", children: "Remaining to Split" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[#9AA4AF] mt-0.5 uppercase tracking-wider", children: [
              "₹",
              remainingAmt.toFixed(2),
              " must be paid out-of-pocket"
            ] })
          ] }) : /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-[#E8EDF2]", children: "Who Paid?" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[#66707A]", children: "Split" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsMultiPayer(!isMultiPayer),
                className: `w-10 h-5 rounded-full transition-all relative ${isMultiPayer ? showRemainingWarning ? "bg-[#FF4757]" : "bg-[#2DD4BF]" : "bg-[#66707A]/40"}`,
                children: /* @__PURE__ */ jsx("div", { className: `absolute top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform ${isMultiPayer ? "left-5" : "left-0.5"}` })
              }
            )
          ] })
        ] }),
        !isMultiPayer ? /* @__PURE__ */ jsx(
          "select",
          {
            value: singlePayerId,
            onChange: (e) => setSinglePayerId(e.target.value),
            className: `panku-input ${showRemainingWarning ? "relative z-10" : ""}`,
            children: currentEvent.members.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
          }
        ) : /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${showRemainingWarning ? "relative z-10" : ""}`, children: [
          currentEvent.members.map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: `w-7 h-7 rounded-full ${getAvatarClass$3(m.name)} text-[10px] font-bold text-[#0B0F14] flex items-center justify-center shrink-0`, children: m.name.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm text-[#E8EDF2] font-medium", children: m.name }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#66707A] text-sm", children: "₹" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  placeholder: "0",
                  value: multiPayerAmounts[m.id] ?? "",
                  onChange: (e) => setMultiPayerAmounts({ ...multiPayerAmounts, [m.id]: e.target.value }),
                  className: "panku-input w-28 pl-7 pr-3 py-2 text-sm"
                }
              )
            ] })
          ] }, m.id)),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-white/[0.04]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[#66707A]", children: "Total Split" }),
            /* @__PURE__ */ jsxs("span", { className: `text-sm font-bold ${Math.abs(remainingAmt - multiTotal) > 0.01 ? "text-[#FF4757]" : "text-[#2ED573]"}`, children: [
              "₹",
              multiTotal.toFixed(2),
              " / ₹",
              remainingAmt.toFixed(2)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold text-[#E8EDF2]", children: "Participants" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                if (participants.size === currentEvent.members.length) setParticipants(/* @__PURE__ */ new Set());
                else setParticipants(new Set(currentEvent.members.map((m) => m.id)));
              },
              className: "text-xs text-[#2DD4BF] font-semibold bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 px-2.5 py-1 rounded-lg transition-colors",
              children: participants.size === currentEvent.members.length ? "Deselect All" : "Select All"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: currentEvent.members.map((m) => {
          const sel = participants.has(m.id);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggleParticipant(m.id),
              className: `flex items-center gap-2 px-3 py-2 rounded-[14px] text-sm font-medium transition-all active:scale-95 border ${sel ? "bg-gradient-to-br from-[#2DD4BF]/20 to-[#14B8A6]/10 border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_4px_12px_rgba(45,212,191,0.15)]" : "panku-card-inner border-white/5 text-[#94A3B8] hover:border-white/15"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: `w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${sel ? `bg-teal-gradient text-[#030609]` : "bg-white/10 text-[#64748B]"}`, children: sel ? /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 }) : m.name.charAt(0).toUpperCase() }),
                m.name
              ]
            },
            m.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full btn-teal font-bold py-4 text-base flex justify-center items-center gap-2", children: [
        /* @__PURE__ */ jsx(Check, { size: 20 }),
        /* @__PURE__ */ jsx("span", { children: "Save Expense" })
      ] })
    ] })
  ] });
};
const getCategoryIcon = (title) => {
  const t = title.toLowerCase();
  if (/dinner|food|restaurant|lunch|breakfast|meal|eat/.test(t)) return /* @__PURE__ */ jsx(Utensils, { size: 24, strokeWidth: 1.5 });
  if (/travel|flight|air|ticket|train|bus/.test(t)) return /* @__PURE__ */ jsx(Plane, { size: 24, strokeWidth: 1.5 });
  if (/taxi|cab|uber|ola|auto|ride/.test(t)) return /* @__PURE__ */ jsx(CarTaxiFront, { size: 24, strokeWidth: 1.5 });
  if (/grocery|groceries|market|shopping/.test(t)) return /* @__PURE__ */ jsx(ShoppingCart, { size: 24, strokeWidth: 1.5 });
  if (/hotel|stay|accommodation|hostel|resort/.test(t)) return /* @__PURE__ */ jsx(Hotel, { size: 24, strokeWidth: 1.5 });
  if (/coffee|cafe|tea|brew/.test(t)) return /* @__PURE__ */ jsx(Coffee, { size: 24, strokeWidth: 1.5 });
  if (/movie|cinema|film|show/.test(t)) return /* @__PURE__ */ jsx(Film, { size: 24, strokeWidth: 1.5 });
  if (/party|birthday|celebrate|fest/.test(t)) return /* @__PURE__ */ jsx(PartyPopper, { size: 24, strokeWidth: 1.5 });
  if (/beer|alcohol|bar|pub|drinks/.test(t)) return /* @__PURE__ */ jsx(Beer, { size: 24, strokeWidth: 1.5 });
  if (/petrol|fuel|gas|diesel/.test(t)) return /* @__PURE__ */ jsx(Fuel, { size: 24, strokeWidth: 1.5 });
  if (/medicine|medical|doctor|hospital/.test(t)) return /* @__PURE__ */ jsx(Pill, { size: 24, strokeWidth: 1.5 });
  if (/rent|house|flat|pg/.test(t)) return /* @__PURE__ */ jsx(Home, { size: 24, strokeWidth: 1.5 });
  return /* @__PURE__ */ jsx(Banknote, { size: 24, strokeWidth: 1.5 });
};
const AVATAR$2 = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7"];
const getAvatarClass$2 = (name) => AVATAR$2[name.charCodeAt(0) % AVATAR$2.length];
const ExpensesScreen = () => {
  const { currentEvent, removeExpense } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  if (!currentEvent) return null;
  const total = currentEvent.expenses.reduce((s, e) => s + e.amount, 0);
  const isFundMode = currentEvent.mode === "fund";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-[#E8EDF2]", children: "Expenses" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#9AA4AF] text-sm mt-0.5", children: "Track every shared cost." })
      ] }),
      !showAddForm && /* @__PURE__ */ jsx("button", { onClick: () => setShowAddForm(true), className: "fab-teal w-11 h-11", title: "Add Expense", children: /* @__PURE__ */ jsx(Plus, { size: 22, strokeWidth: 2.5 }) })
    ] }),
    !showAddForm && currentEvent.expenses.length > 0 && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        className: "relative rounded-[24px] p-6 mb-5 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2", children: "Total Event Cost" }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-[#030609] tracking-tight", children: formatCurrency(total) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.expenses.length }),
              " Expenses"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.members.length }),
              " Members"
            ] })
          ] })
        ]
      }
    ),
    showAddForm ? /* @__PURE__ */ jsx(ExpenseForm, { onCancel: () => setShowAddForm(false), onSave: () => setShowAddForm(false) }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: currentEvent.expenses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "panku-card py-16 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none hover:border-white/20", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#2DD4BF] mb-4 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsx(Banknote, { size: 28, strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[#F8FAFC] font-bold text-lg mb-1", children: "No expenses yet" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[#94A3B8] text-sm mb-6 max-w-[200px] mx-auto", children: [
        "Tap ",
        /* @__PURE__ */ jsx("strong", { className: "text-[#2DD4BF]", children: "+" }),
        " to add your first expense."
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setShowAddForm(true), className: "btn-teal px-6 py-3 font-semibold inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { size: 18 }),
        "Add First Expense"
      ] })
    ] }) : /* @__PURE__ */ jsx(AnimatePresence, { children: currentEvent.expenses.map((expense, idx) => {
      const paidBy = expense.paidBy.map((p) => {
        var _a;
        return {
          name: ((_a = currentEvent.members.find((m) => m.id === p.memberId)) == null ? void 0 : _a.name) ?? "Unknown",
          amount: p.amount
        };
      });
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
          transition: { delay: idx * 0.04, type: "spring", stiffness: 400, damping: 25 },
          className: "panku-card p-4 flex items-center gap-4 group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-[14px] panku-card-inner flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform text-[#2DD4BF]", children: getCategoryIcon(expense.title) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-[#E8EDF2] text-sm truncate", children: expense.title }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#9AA4AF] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full shrink-0", children: [
                  expense.participants.length,
                  " people"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center flex-wrap gap-1 mt-1", children: (() => {
                const membersPaidSum = expense.paidBy.reduce((acc, p) => acc + p.amount, 0);
                const fundPaidAmount = expense.amount - membersPaidSum;
                const hasFundPayment = isFundMode && fundPaidAmount > 0.01;
                if (!hasFundPayment && paidBy.length === 0) return null;
                return /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-[#66707A]", children: "Paid by" }),
                  hasFundPayment && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#2DD4BF] font-black uppercase tracking-wider bg-[#2DD4BF]/10 px-1.5 py-0.5 rounded flex items-center border border-[#2DD4BF]/20", children: [
                    "Fund ",
                    paidBy.length > 0 && `(${formatCurrency(fundPaidAmount)})`
                  ] }),
                  paidBy.map(({ name, amount }) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: `w-4 h-4 rounded-full ${getAvatarClass$2(name)} text-[8px] font-bold text-[#0B0F14] flex items-center justify-center shrink-0`, children: name.charAt(0).toUpperCase() }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#9AA4AF]", children: [
                      name,
                      " ",
                      hasFundPayment || paidBy.length > 1 ? `(${formatCurrency(amount)})` : ""
                    ] })
                  ] }, name))
                ] });
              })() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg font-black text-[#F8FAFC]", children: formatCurrency(expense.amount) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    if (window.confirm(`Delete "${expense.title}"?`)) removeExpense(expense.id);
                  },
                  className: "text-[#64748B] hover:text-[#FF4757] p-1.5 rounded-lg hover:bg-[#FF4757]/10 transition-all bg-white/5",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                }
              )
            ] })
          ]
        },
        expense.id
      );
    }) }) })
  ] });
};
const AVATAR$1 = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7"];
const getAvatarClass$1 = (name) => AVATAR$1[name.charCodeAt(0) % AVATAR$1.length];
const ResultsScreen = () => {
  const { currentEvent } = useAppContext();
  const { balances, settlements, totalExpense, totalFund, totalSpentFromFund, remainingFund } = useMemo(() => {
    if (!currentEvent) return { balances: [], settlements: [], totalExpense: 0, totalFund: 0, totalSpentFromFund: 0, remainingFund: 0 };
    const calculatedBalances = calculateBalances(currentEvent);
    const totalExp = currentEvent.expenses.reduce((sum, e) => sum + e.amount, 0);
    const isFundMode2 = currentEvent.mode === "fund";
    const tFund = isFundMode2 ? (currentEvent.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
    const tSpentFromFund = isFundMode2 ? currentEvent.expenses.reduce((s, e) => {
      if (e.poolUsed !== void 0) return s + e.poolUsed;
      const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
      return s + (e.amount - membersPaid);
    }, 0) : 0;
    const rFund = Math.max(0, tFund - tSpentFromFund);
    let balanceList = [...calculatedBalances];
    const calculatedSettlements = calculateSettlements(balanceList);
    return {
      balances: calculatedBalances,
      // Keep original balances for UI
      settlements: calculatedSettlements,
      totalExpense: totalExp,
      totalFund: tFund,
      totalSpentFromFund: tSpentFromFund,
      remainingFund: rFund
    };
  }, [currentEvent]);
  if (!currentEvent) return null;
  const isFundMode = currentEvent.mode === "fund";
  const getMemberName = (id) => {
    var _a;
    return ((_a = currentEvent.members.find((m) => m.id === id)) == null ? void 0 : _a.name) ?? "Unknown";
  };
  return /* @__PURE__ */ jsxs("div", { id: "results-container", className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-[#E8EDF2]", children: "Summary" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#9AA4AF] text-sm mt-0.5", children: "Final breakdown & settlements." })
    ] }),
    currentEvent.expenses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "panku-card py-16 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#2DD4BF] mb-4 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsx(BarChart3, { size: 28, strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[#F8FAFC] font-bold text-lg mb-1", children: "No expenses to summarize" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#94A3B8] text-sm", children: "Add some expenses first to see the breakdown." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          className: "relative rounded-[24px] p-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -right-8 -top-8 w-40 h-40 bg-white/30 rounded-full blur-2xl mix-blend-overlay" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2", children: "Total Expense" }),
            /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-[#030609] tracking-tight", children: formatCurrency(totalExpense) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-[#030609]/15 flex justify-between text-sm relative z-10", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.expenses.length }),
                " Expenses"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[#030609]/70", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[#030609]", children: currentEvent.members.length }),
                " Members"
              ] })
            ] })
          ]
        }
      ),
      isFundMode && /* @__PURE__ */ jsxs("div", { className: "panku-card overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-5 py-4 border-b border-white/[0.04]", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2]", children: "Trip Pool Summary" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#94A3B8]", children: "Initial Pool" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#E8EDF2]", children: formatCurrency(totalFund) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#94A3B8]", children: "Spent from Pool" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#EF4444]", children: formatCurrency(totalSpentFromFund) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-3 border-t border-white/10", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#E8EDF2]", children: "Remaining Pool" }),
            /* @__PURE__ */ jsx("span", { className: `font-black text-lg text-[#2DD4BF]`, children: formatCurrency(remainingFund) })
          ] }),
          remainingFund > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-[11px] text-[#2DD4BF] bg-[#2DD4BF]/10 p-3 rounded-xl border border-[#2DD4BF]/20 leading-relaxed", children: [
            "The remaining ",
            /* @__PURE__ */ jsx("strong", { children: formatCurrency(remainingFund) }),
            " acts as a credit and is redistributed natively in the balances below."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panku-card overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-white/[0.04] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 16, className: "text-[#2DD4BF]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2]", children: "Member Balances" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-white/[0.04]", children: balances.map((b, idx) => {
          const name = getMemberName(b.memberId);
          const balance = b.balance;
          const isPositive = balance >= 0;
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: idx * 0.05 },
              className: "flex items-center gap-4 px-5 py-4",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-full ${getAvatarClass$1(name)} flex items-center justify-center font-bold text-[#030609] text-sm shrink-0`,
                    style: { boxShadow: `0 0 0 2px #141A21, 0 0 0 3px ${isPositive ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}` },
                    children: name.charAt(0).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-[#F8FAFC] text-sm", children: name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B]", children: [
                      "Paid ",
                      /* @__PURE__ */ jsx("span", { className: "text-[#94A3B8] font-bold", children: formatCurrency(b.totalPaid) })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B]", children: [
                      "Share ",
                      /* @__PURE__ */ jsx("span", { className: "text-[#94A3B8] font-bold", children: formatCurrency(b.totalShare) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `px-3 py-1.5 rounded-xl text-sm font-black ${isPositive ? "glow-teal bg-[#10B981]/10 text-[#10B981]" : "glow-red bg-[#EF4444]/10 text-[#EF4444]"}`,
                    children: [
                      isPositive ? "+" : "",
                      formatCurrency(balance)
                    ]
                  }
                )
              ]
            },
            b.memberId
          );
        }) })
      ] }),
      settlements.length > 0 && /* @__PURE__ */ jsxs("div", { className: "panku-card overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-white/[0.04] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "text-[#2DD4BF]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#E8EDF2]", children: "Settlements" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#66707A] ml-auto", children: "Who pays whom" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-white/[0.04]", children: settlements.map((s, idx) => {
          const fromName = getMemberName(s.from);
          const toName = getMemberName(s.to);
          const isFromFund = s.from === "FUND_BOX";
          const isToFund = s.to === "FUND_BOX";
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 + idx * 0.05 },
              className: "flex items-center gap-3 px-5 py-4",
              children: [
                /* @__PURE__ */ jsx("span", { className: `w-9 h-9 rounded-full ${isFromFund ? "bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20" : getAvatarClass$1(fromName)} text-xs font-bold text-[#030609] flex items-center justify-center shrink-0`, children: isFromFund ? "FD" : fromName.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-medium text-sm truncate ${isFromFund ? "text-[#2DD4BF]" : "text-[#E8EDF2]"}`, children: fromName }),
                  /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "text-[#64748B] shrink-0" }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium text-sm truncate ${isToFund ? "text-[#2DD4BF]" : "text-[#E8EDF2]"}`, children: toName })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-extrabold text-[#E8EDF2] text-sm shrink-0", children: formatCurrency(s.amount) })
              ]
            },
            idx
          );
        }) })
      ] }),
      settlements.length === 0 && balances.length > 0 && /* @__PURE__ */ jsxs("div", { className: "panku-card p-6 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none hover:border-white/20", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] mb-4 border border-[#2DD4BF]/20 shadow-[0_0_20px_rgba(45,212,191,0.15)]", children: /* @__PURE__ */ jsx(PartyPopper, { size: 28, strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsx("p", { className: "text-[#2DD4BF] font-bold text-lg mb-1", children: "All balances are settled!" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#94A3B8] text-sm", children: "No payments needed." })
      ] })
    ] })
  ] });
};
const formatForPDF = (amount) => {
  return "Rs. " + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};
const generatePDF = async (event) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const primaryText = "#0B0F14";
    const secondaryText = "#66707A";
    const accent = "#2DD4BF";
    const addText = (text, x, y, size, color, isBold = false, align = "left") => {
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(color);
      pdf.text(text, x, y, { align });
    };
    let currentY = 25;
    const logoUrl = "/Assets/logo-lightbg.png";
    let logoLoaded = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3e3);
      const response = await fetch(logoUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        const dataUrl = await new Promise((resolve) => {
          reader.onloadend = () => {
            const result = reader.result;
            resolve(typeof result === "string" && result.startsWith("data:image") ? result : null);
          };
          reader.onerror = () => resolve(null);
        });
        if (dataUrl) {
          const { w, h } = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 1, h: 1 });
            img.src = dataUrl;
          });
          const targetH = 12;
          const targetW = w / h * targetH;
          try {
            pdf.addImage(dataUrl, "PNG", margin, currentY - 10, targetW, targetH);
            logoLoaded = true;
          } catch (_) {
          }
        }
      }
    } catch (_) {
    }
    if (!logoLoaded) {
      addText("Panku.", margin, currentY, 24, accent, true);
    }
    currentY += 15;
    addText("Expense Settlement Report", margin, currentY, 18, primaryText, true);
    currentY += 8;
    addText(`Event: ${event.name}`, margin, currentY, 11, secondaryText);
    const eventDate = new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    addText(`Date: ${eventDate}`, margin, currentY + 6, 11, secondaryText);
    currentY += 16;
    pdf.setDrawColor(accent);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    const balances = calculateBalances(event);
    const totalExp = event.expenses.reduce((s, e) => s + e.amount, 0);
    const isFundMode = event.mode === "fund";
    const tFund = isFundMode ? (event.fundDeposits || []).reduce((s, d) => s + d.amount, 0) : 0;
    const tSpentFromFund = isFundMode ? event.expenses.reduce((s, e) => {
      if (e.poolUsed !== void 0) return s + e.poolUsed;
      const membersPaid = e.paidBy.reduce((acc, p) => acc + p.amount, 0);
      return s + (e.amount - membersPaid);
    }, 0) : 0;
    const rFund = Math.max(0, tFund - tSpentFromFund);
    let balanceList = [...balances];
    const settlements = calculateSettlements(balanceList);
    const getMemberName = (id) => {
      var _a;
      return ((_a = event.members.find((m) => m.id === id)) == null ? void 0 : _a.name) ?? "Unknown";
    };
    currentY += 15;
    if (isFundMode) {
      addText("Trip Pool Summary", margin, currentY, 14, primaryText, true);
      currentY += 8;
      addText("Initial Pool:", margin, currentY, 11, secondaryText);
      addText(formatForPDF(tFund), margin + 40, currentY, 11, primaryText, true);
      currentY += 7;
      addText("Spent from Pool:", margin, currentY, 11, secondaryText);
      addText(formatForPDF(tSpentFromFund), margin + 40, currentY, 11, "#EF4444", true);
      currentY += 7;
      addText("Remaining Pool:", margin, currentY, 11, secondaryText);
      addText(formatForPDF(rFund), margin + 40, currentY, 11, accent, true);
      currentY += 12;
      pdf.setDrawColor("#E8EDF2");
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 15;
    }
    addText("Event Summary", margin, currentY, 14, primaryText, true);
    currentY += 8;
    addText("Total Event Cost:", margin, currentY, 11, secondaryText);
    addText(formatForPDF(totalExp), margin + 40, currentY, 11, primaryText, true);
    currentY += 7;
    addText("Members count:", margin, currentY, 11, secondaryText);
    addText(event.members.length.toString(), margin + 40, currentY, 11, primaryText, true);
    currentY += 7;
    addText("Expenses count:", margin, currentY, 11, secondaryText);
    addText(event.expenses.length.toString(), margin + 40, currentY, 11, primaryText, true);
    currentY += 12;
    pdf.setDrawColor("#E8EDF2");
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
    addText("Member Balances", margin, currentY, 14, primaryText, true);
    currentY += 10;
    balances.forEach((b) => {
      const name = getMemberName(b.memberId);
      const balanceText = formatForPDF(Math.abs(b.balance));
      const isPositive = b.balance >= 0;
      const balanceColor = isPositive ? "#10B981" : "#EF4444";
      const sign = isPositive ? "+" : "-";
      addText(name, margin, currentY, 11, primaryText, true);
      addText(`Paid: ${formatForPDF(b.totalPaid)}  |  Share: ${formatForPDF(b.totalShare)}`, margin, currentY + 5, 9, secondaryText);
      const fullBalanceText = `${sign}${balanceText}`;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      const bTextW = pdf.getStringUnitWidth(fullBalanceText) * 11 / pdf.internal.scaleFactor;
      const bPillW = bTextW + 8;
      const bPillH = 7;
      const bPillX = pageWidth - margin - bPillW;
      const bPillY = currentY - 5;
      pdf.setFillColor(isPositive ? "#E6F8EF" : "#FDECEE");
      pdf.roundedRect(bPillX, bPillY, bPillW, bPillH, 1.5, 1.5, "F");
      addText(fullBalanceText, pageWidth - margin - 4, currentY, 11, balanceColor, true, "right");
      currentY += 14;
      if (currentY > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        currentY = margin + 10;
      }
    });
    currentY += 10;
    pdf.setDrawColor("#E8EDF2");
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
    addText("Settlements (Who pays whom)", margin, currentY, 14, primaryText, true);
    currentY += 10;
    if (settlements.length === 0) {
      addText("All balances are settled! No payments needed.", margin, currentY, 11, accent, true);
    } else {
      settlements.forEach((s) => {
        const fromName = getMemberName(s.from);
        const toName = getMemberName(s.to);
        const isFromFund = s.from === "FUND_BOX";
        const isToFund = s.to === "FUND_BOX";
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        const fromWidth = pdf.getStringUnitWidth(fromName) * 11 / pdf.internal.scaleFactor;
        addText(fromName, margin, currentY, 11, isFromFund ? accent : primaryText, true);
        const badgeText = "PAYS";
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        const badgeTextWidth = pdf.getStringUnitWidth(badgeText) * 7 / pdf.internal.scaleFactor;
        const badgeWidth = badgeTextWidth + 4;
        const badgeHeight = 4.5;
        const badgeX = margin + fromWidth + 3;
        const badgeY = currentY - 3;
        pdf.setFillColor(accent);
        pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1, 1, "F");
        addText(badgeText, badgeX + 2, currentY + 0.3, 7, "#FFFFFF", true);
        const toNameX = badgeX + badgeWidth + 3;
        addText(toName, toNameX, currentY, 11, isToFund ? accent : primaryText, true);
        addText(formatForPDF(s.amount), pageWidth - margin, currentY, 12, primaryText, true, "right");
        currentY += 10;
        if (currentY > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          currentY = margin + 10;
        }
      });
    }
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      addText(`Generated by Panku App | Split Expenses, Not Friendships - Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, 8, secondaryText, false, "center");
    }
    const filename = `${event.name.replace(/[^a-zA-Z0-9]/g, "_")}_Settlement.pdf`;
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
const CHART_COLORS = ["#38F2C2", "#33DBC5", "#41C6A6", "#48C1E7", "#FB9061"];
const ReportScreen = () => {
  const { currentEvent } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const { chartsData } = useMemo(() => {
    if (!currentEvent) return { totalExpense: 0, chartsData: null };
    const total = currentEvent.expenses.reduce((sum, e) => sum + e.amount, 0);
    const pieData = currentEvent.expenses.reduce((acc, exp) => {
      const existing = acc.find((a) => a.name === exp.title);
      if (existing) existing.value += exp.amount;
      else acc.push({ name: exp.title, value: exp.amount });
      return acc;
    }, []).sort((a, b) => b.value - a.value).slice(0, 5);
    const balances = calculateBalances(currentEvent);
    const barData = balances.map((b) => {
      var _a;
      return {
        name: ((_a = currentEvent.members.find((m) => m.id === b.memberId)) == null ? void 0 : _a.name) ?? "User",
        Paid: b.totalPaid,
        Share: b.totalShare
      };
    });
    return { totalExpense: total, chartsData: { pieData, barData } };
  }, [currentEvent]);
  if (!currentEvent) return null;
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generatePDF(currentEvent);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3e3);
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-slide-up", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-[#E5F3F2]", children: "Report" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#8FA9B2] text-sm", children: "Visual breakdown of your event." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleExport,
          disabled: isExporting || currentEvent.expenses.length === 0,
          className: `btn-teal px-5 py-2.5 flex items-center gap-2 text-sm ${exportSuccess ? "bg-success shadow-none" : ""}`,
          children: [
            exportSuccess ? /* @__PURE__ */ jsx(CheckCircle2, { size: 18 }) : /* @__PURE__ */ jsx(Download, { size: 18 }),
            exportSuccess ? "Saved!" : "Export PDF"
          ]
        }
      )
    ] }),
    currentEvent.expenses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "panku-card p-12 text-center border-dashed", children: [
      /* @__PURE__ */ jsx(BarChart3, { size: 48, className: "mx-auto text-[#5C7280] mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "font-bold text-[#8FA9B2]", children: "No analytics available yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#5C7280] text-xs mt-1", children: "Add expenses to see the magic happen." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "panku-card p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsx(PieChart, { size: 18, className: "text-[#2DD4BF]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm uppercase tracking-wider text-[#8FA9B2]", children: "Expense Distribution" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-[220px] w-full touch-pan-y", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart$1, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: chartsData == null ? void 0 : chartsData.pieData,
              cx: "50%",
              cy: "50%",
              innerRadius: 60,
              outerRadius: 80,
              paddingAngle: 5,
              dataKey: "value",
              children: chartsData == null ? void 0 : chartsData.pieData.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: { backgroundColor: "#132027", borderRadius: "12px", border: "1px solid #1E3A4A", color: "#E5F3F2" },
              itemStyle: { color: "#2DD4BF" }
            }
          ),
          /* @__PURE__ */ jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panku-card p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 18, className: "text-[#2DD4BF]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm uppercase tracking-wider text-[#8FA9B2]", children: "Payments by Member" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-[250px] w-full touch-pan-y", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: chartsData == null ? void 0 : chartsData.barData, children: [
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#5C7280", fontSize: 10, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#5C7280", fontSize: 10, axisLine: false, tickLine: false, hide: true }),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              cursor: { fill: "rgba(255,255,255,0.05)" },
              contentStyle: { backgroundColor: "#132027", borderRadius: "12px", border: "1px solid #1E3A4A" }
            }
          ),
          /* @__PURE__ */ jsx(Legend, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Paid", fill: "#14B8A6", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Share", fill: "#33DBC5", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panku-card overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-5 border-b border-white/[0.04]", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 18, className: "text-[#2DD4BF]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm uppercase tracking-wider text-[#8FA9B2]", children: "Individual Shares" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-white/[0.04]", children: chartsData == null ? void 0 : chartsData.barData.map((data, idx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-5 py-4", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-[#E5F3F2]", children: data.name }),
          /* @__PURE__ */ jsx("span", { className: "font-extrabold text-[#2DD4BF]", children: formatCurrency(data.Share) })
        ] }, idx)) })
      ] })
    ] })
  ] });
};
const DISMISSED_KEY = "panku-install-dismissed";
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    console.log("[PWA] Standalone mode:", window.matchMedia("(display-mode: standalone)").matches);
    console.log("[PWA] Dismissed:", !!localStorage.getItem(DISMISSED_KEY));
    console.log("[PWA] iOS detected:", isIOSDevice);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("[PWA] Already in standalone mode");
      return;
    }
    if (isIOSDevice && !localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
    const handler = (e) => {
      console.log("[PWA] beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem(DISMISSED_KEY)) {
        setVisible(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const handleInstall = async () => {
    if (isIOS) {
      alert('To install Panku on your iPhone: \n1. Tap the Share button (square with arrow up) \n2. Scroll down and tap "Add to Home Screen"');
      handleDismiss();
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };
  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 50, opacity: 0, scale: 0.9 },
      animate: { y: 0, opacity: 1, scale: 1 },
      exit: { y: 50, opacity: 0, scale: 0.9 },
      transition: { type: "spring", stiffness: 350, damping: 25 },
      className: "fixed bottom-28 left-0 right-0 z-[9999] px-6 flex justify-center pointer-events-none",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "pointer-events-auto rounded-3xl p-5 w-full max-w-sm flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
          style: {
            background: "rgba(13, 18, 25, 0.98)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(28, 232, 183, 0.4)"
          },
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20",
                style: { background: "linear-gradient(135deg, #A8F06E 0%, #1CE8B7 100%)" },
                children: /* @__PURE__ */ jsx(Download, { size: 24, className: "text-[#0B0F14]", strokeWidth: 2.5 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", onClick: handleInstall, style: { cursor: "pointer" }, children: [
              /* @__PURE__ */ jsx("p", { className: "text-white font-black text-base leading-tight", children: "Install Panku App" }),
              /* @__PURE__ */ jsx("p", { className: "text-[#1CE8B7] font-bold text-sm mt-0.5 underline decoration-2 underline-offset-4 active:opacity-70 transition-opacity", children: isIOS ? "Tap Share → Add to Screen" : "To install, click here" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleDismiss,
                className: "w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors shrink-0",
                style: { background: "rgba(255,255,255,0.05)" },
                "aria-label": "Dismiss",
                children: /* @__PURE__ */ jsx(X, { size: 18 })
              }
            )
          ]
        }
      )
    }
  ) });
};
const AVATAR = ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7"];
const getAvatarClass = (name) => AVATAR[name.charCodeAt(0) % AVATAR.length];
const FundDepositsScreen = () => {
  var _a;
  const { currentEvent, addFundDeposit, removeFundDeposit } = useAppContext();
  const [selectedMember, setSelectedMember] = useState("");
  const [amount, setAmount] = useState("");
  if (!currentEvent || currentEvent.mode !== "fund") return null;
  const totalFund = (currentEvent.fundDeposits || []).reduce((acc, d) => acc + d.amount, 0);
  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedMember || !amount) return;
    addFundDeposit({
      memberId: selectedMember,
      amount: parseFloat(amount),
      date: (/* @__PURE__ */ new Date()).toISOString()
    });
    setAmount("");
    setSelectedMember("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "pb-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-[#E8EDF2]", children: "Deposits" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#9AA4AF] text-sm mt-0.5", children: "Manage the shared trip pool." })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        className: "relative rounded-[24px] p-6 mb-6 overflow-hidden shadow-[0_8px_32px_rgba(45,212,191,0.25)] border border-white/20 bg-teal-gradient",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl mix-blend-overlay" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#030609]/70 text-xs font-bold uppercase tracking-widest mb-2", children: "Total Pool" }),
          /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-[#030609] tracking-tight", children: formatCurrency(totalFund) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-[#030609]/80 font-medium z-10 relative", children: [
            ((_a = currentEvent.fundDeposits) == null ? void 0 : _a.length) || 0,
            " Deposits Collected"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "panku-card p-5 mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#E8EDF2] mb-4 uppercase tracking-wider", children: "Add Deposit" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleAdd, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
            "select",
            {
              className: "panku-input",
              value: selectedMember,
              onChange: (e) => setSelectedMember(e.target.value),
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select Member" }),
                currentEvent.members.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]", children: /* @__PURE__ */ jsx(IndianRupee, { size: 16 }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                required: true,
                min: "1",
                step: "any",
                className: "panku-input pl-8",
                placeholder: "Amount",
                value: amount,
                onChange: (e) => setAmount(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn-teal w-full py-3 font-bold flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { size: 18 }),
          " Add to Pool"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold text-[#9AA4AF] uppercase tracking-widest mb-3", children: "Recent Deposits" }),
      !currentEvent.fundDeposits || currentEvent.fundDeposits.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "panku-card py-10 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none", children: [
        /* @__PURE__ */ jsx(Wallet, { size: 24, className: "mx-auto text-[#64748B] mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#94A3B8] text-sm", children: "No deposits yet. Add one above." })
      ] }) : /* @__PURE__ */ jsx(AnimatePresence, { children: currentEvent.fundDeposits.map((deposit) => {
        var _a2;
        const memberName = ((_a2 = currentEvent.members.find((m) => m.id === deposit.memberId)) == null ? void 0 : _a2.name) || "Unknown";
        return /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95 },
            className: "panku-card p-4 flex items-center gap-3 group",
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full ${getAvatarClass(memberName)} flex items-center justify-center text-[#0B0F14] font-bold shrink-0`, children: memberName.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[#E8EDF2] text-sm", children: memberName }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#66707A]", children: new Date(deposit.date).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "font-black text-[#2DD4BF]", children: formatCurrency(deposit.amount) }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (window.confirm("Delete deposit?")) removeFundDeposit(deposit.id);
                    },
                    className: "text-[#64748B] hover:text-[#FF4757] p-1.5 rounded-lg transition-colors bg-white/5",
                    children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                  }
                )
              ] })
            ]
          },
          deposit.id
        );
      }) })
    ] })
  ] });
};
const AppContent = () => {
  const { currentEvent } = useAppContext();
  const [activeTab, setActiveTab] = useState("home");
  if (!currentEvent) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[100dvh] w-full overflow-x-hidden bg-transparent", children: /* @__PURE__ */ jsx(HomeScreen, {}) });
  }
  const isFundMode = currentEvent.mode === "fund";
  const tabs = isFundMode ? [
    { id: "home", label: "Home", icon: /* @__PURE__ */ jsx(Home, { size: 20 }) },
    { id: "fund", label: "Deposits", icon: /* @__PURE__ */ jsx(Wallet, { size: 20 }) },
    { id: "expenses", label: "Expenses", icon: /* @__PURE__ */ jsx(Receipt, { size: 20 }) },
    { id: "summary", label: "Summary", icon: /* @__PURE__ */ jsx(PieChart, { size: 20 }) },
    { id: "report", label: "Report", icon: /* @__PURE__ */ jsx(BarChart3, { size: 20 }) }
  ] : [
    { id: "home", label: "Home", icon: /* @__PURE__ */ jsx(Home, { size: 20 }) },
    { id: "expenses", label: "Expenses", icon: /* @__PURE__ */ jsx(Receipt, { size: 20 }) },
    { id: "summary", label: "Summary", icon: /* @__PURE__ */ jsx(PieChart, { size: 20 }) },
    { id: "report", label: "Report", icon: /* @__PURE__ */ jsx(BarChart3, { size: 20 }) }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[100dvh] w-full overflow-x-hidden bg-transparent flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 w-full max-w-lg mx-auto px-4 py-5 pb-32", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.18, ease: "easeOut" },
        children: [
          activeTab === "home" && /* @__PURE__ */ jsx(DashboardScreen, {}),
          activeTab === "fund" && /* @__PURE__ */ jsx(FundDepositsScreen, {}),
          activeTab === "expenses" && /* @__PURE__ */ jsx(ExpensesScreen, {}),
          activeTab === "summary" && /* @__PURE__ */ jsx(ResultsScreen, {}),
          activeTab === "report" && /* @__PURE__ */ jsx(ReportScreen, {})
        ]
      },
      activeTab
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none", children: /* @__PURE__ */ jsx(
      "nav",
      {
        className: "pointer-events-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2 p-2 rounded-2xl w-full max-w-sm mx-auto",
        style: {
          background: "rgba(10, 28, 40, 0.75)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 16px 40px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
        },
        children: tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab(tab.id),
              className: "relative flex-1 sm:flex-none flex flex-col items-center justify-center px-1 sm:px-6 py-2.5 rounded-xl focus:outline-none transition-all",
              children: [
                isActive && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    layoutId: "active-tab-bg",
                    className: "absolute inset-0 rounded-xl bg-teal-gradient",
                    transition: { type: "spring", stiffness: 380, damping: 30 }
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: `relative flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? "text-[#030609]" : "text-[#9AA4AF] hover:text-[#E8EDF2]"}`, children: [
                  /* @__PURE__ */ jsxs("span", { className: "relative", children: [
                    tab.icon,
                    tab.id === "expenses" && currentEvent.expenses.length > 0 && !isActive && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-2.5 bg-[#2DD4BF] text-[#030609] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center", children: currentEvent.expenses.length })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider`, children: tab.label })
                ] })
              ]
            },
            tab.id
          );
        })
      }
    ) })
  ] });
};
const PwaApp = () => /* @__PURE__ */ jsxs(AppProvider, { children: [
  /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04] animate-blob" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#2DD4BF] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] animate-blob animation-delay-2000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-15%] left-[10%] w-[600px] h-[600px] bg-[#38F2C2] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.03] animate-blob animation-delay-4000" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0A1C28] rounded-full mix-blend-overlay filter blur-[80px] opacity-[0.8]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#05080c] mix-blend-overlay opacity-90" })
  ] }),
  /* @__PURE__ */ jsx(AppContent, {}),
  /* @__PURE__ */ jsx(InstallPrompt, {})
] });
const SeoLayout = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[100dvh] w-full overflow-x-hidden bg-transparent flex flex-col relative z-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04] animate-blob" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#2DD4BF] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] animate-blob animation-delay-2000" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-15%] left-[10%] w-[600px] h-[600px] bg-[#38F2C2] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.03] animate-blob animation-delay-4000" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0A1C28] rounded-full mix-blend-overlay filter blur-[80px] opacity-[0.8]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#05080c] mix-blend-overlay opacity-90" })
    ] }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 w-full max-w-3xl mx-auto px-4 py-8 pb-32", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxs("footer", { className: "w-full mt-auto py-12 px-6 border-t border-white/5 bg-[#030609]/80 backdrop-blur-md relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-4 font-inter text-lg", children: "Panku App" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Split expenses with friends easily. The best offline expense tracker for trips, outings, and events." }),
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 hover:text-white font-semibold transition-colors", children: "Open Web App →" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-4 tracking-wide uppercase text-xs", children: "Features & Utility" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "About Us" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/how-it-works", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "How It Works" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/use-cases/college-trip-expenses", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "College Trip Expenses" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/use-cases/group-dinner-bill-split", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "Split Dinner Bills" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-4 tracking-wide uppercase text-xs", children: "Top Guides" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog/split-expenses-friends", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "How to Split Expenses with Friends" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog/splitwise-alternative", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "Best Splitwise Alternatives" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog/group-trip-expense-tracking", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "Group Trip Expense Guide" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog/offline-expense-tracker", className: "text-gray-400 hover:text-teal-400 transition-colors", children: "Offline Expense Tracker" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Panku App. All rights reserved."
      ] })
    ] }),
    /* @__PURE__ */ jsx(InstallPrompt, {})
  ] });
};
const AboutPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: "text-gray-300 space-y-8 animate-fade-in font-inter leading-relaxed", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "About Panku | Free Offline Expense Tracker & Bill Splitter" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Discover why we built Panku, the minimal, lightning-fast expense splitter for friends and groups. Learn more about our privacy-first, offline-ready approach." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/about" })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-semibold text-teal-400 bg-teal-400/10 rounded-full ring-1 ring-inset ring-teal-400/20", children: "Our Mission" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight", children: [
        "Split Expenses, ",
        /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
        " Not Friendships."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-400 max-w-xl mx-auto", children: "We believe managing group money shouldn't require mandatory logins, slow apps, or awkward conversations." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Why Panku?" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Have you ever gone on a friends trip and ended up with a massive spreadsheet trying to figure out who owes who? Or used heavy apps that force everyone to create an account just to log a $10 pizza?" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
        "Panku was built out of frustration with existing ",
        /* @__PURE__ */ jsx(Link, { to: "/blog/splitwise-alternative", className: "text-teal-400 hover:text-white transition-colors underline decoration-teal-400/30 underline-offset-4", children: "Splitwise alternatives" }),
        ". We wanted an app that was ridiculously simple, worked entirely offline, and required zero sign-ups. You just open it and start tracking."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-teal-400 mb-3", children: "100% Offline" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No signal on your road trip? Tracking expenses in another country? Panku stores your data right on your device as a Progressive Web App." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-teal-400 mb-3", children: "No Accounts Required" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Stop forcing friends to download apps or verify emails. One person can track the entire event effortlessly, then share a neat PDF at the end." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center pt-8 border-t border-white/5 mt-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Ready to track your expenses?" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-flex items-center justify-center px-8 py-4 text-sm font-black text-[#030609] uppercase tracking-widest bg-teal-gradient rounded-xl shadow-[0_0_20px_rgba(28,232,183,0.3)] hover:shadow-[0_0_30px_rgba(28,232,183,0.5)] transition-all", children: "Open Panku App" })
    ] })
  ] });
};
const BLOG_POSTS = [
  {
    slug: "split-expenses-friends",
    title: "How to Split Expenses with Friends (Without Awkwardness)",
    description: "Learn the best strategies to split bills fairly among friends without ruining relationships. See how modern apps like Panku solve this."
  },
  {
    slug: "splitwise-alternative",
    title: "Best Splitwise Alternatives: Free & Offline Options",
    description: "Looking for a Splitwise alternative? Compare the best apps to split expenses with friends without mandatory accounts or logins."
  },
  {
    slug: "group-trip-expense-tracking",
    title: "Best Way to Track Group Expenses During Trips",
    description: "A complete guide to managing shared expenses effectively during group travel. Say goodbye to spreadsheets."
  },
  {
    slug: "offline-expense-tracker",
    title: "Offline Expense Tracker Apps (No Internet Needed)",
    description: "Why tracking expenses offline is crucial for travelers and how the right app can save your wallet overseas."
  },
  {
    slug: "college-trip-expense-split",
    title: "How to Split Expenses on a College Trip",
    description: "The ultimate budget guide for students. Easily track your shared costs so nobody overpays."
  }
];
const BlogIndex = () => {
  return /* @__PURE__ */ jsxs("div", { className: "text-gray-300 font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Panku Blog | Guides on Splitting Expenses & Managing Money" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Read expert guides on how to split expenses with friends, track group trips, and find the best Splitwise alternatives via the Panku Blog." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog" })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-4", children: "Guides & Resources" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-400", children: "Everything you need to know about managing shared finances." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: BLOG_POSTS.map((post) => /* @__PURE__ */ jsx(Link, { to: `/blog/${post.slug}`, className: "block group", children: /* @__PURE__ */ jsxs("article", { className: "p-6 bg-[#0A1C28]/40 border border-white/5 rounded-2xl transition-all hover:bg-[#0A1C28]/80 hover:border-teal-400/30", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors", children: post.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: post.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 text-teal-400 text-sm font-semibold flex items-center", children: [
        "Read full article ",
        /* @__PURE__ */ jsx("span", { className: "ml-2 group-hover:translate-x-1 transition-transform", children: "→" })
      ] })
    ] }) }, post.slug)) })
  ] });
};
const structuredData$1 = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Split Expenses with Friends (Without Awkwardness)",
  "author": {
    "@type": "Organization",
    "name": "Panku App"
  },
  "description": "Learn the best ways to track and split expenses with friends without ruining your relationship. Try the easiest Splitwise alternative."
};
const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you split expenses with friends?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The easiest way is to use a free, offline-ready tool like Panku. One person logs the expenses, and at the end of the trip, you get a clean summary of who owes whom, without everyone needing to create an account."
      }
    }
  ]
};
const SplitExpensesFriends = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "How to Split Expenses with Friends (Without Awkwardness) | Panku" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Learn the best ways to track and split expenses with friends without ruining your relationship. Try the easiest Splitwise alternative." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog/split-expenses-friends" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData$1) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(faqData) })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight", children: [
        "How to Split Expenses with Friends ",
        /* @__PURE__ */ jsx("span", { className: "text-teal-400 block mt-2", children: "(Without Awkwardness)" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400", children: "Money talks shouldn't ruin your weekend getaway." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "The Awkward Money Problem" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed mb-6", children: `You're at a group dinner. The bill arrives, and suddenly everyone is doing mental math. Someone pays, and then you hear the dreaded phrase: "I'll Venmo you." Three weeks later, you're still waiting for that Venmo, and it's too awkward to bring it up. We've all been there.` }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Common Mistakes When Splitting Bills" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-gray-300 mb-8 list-disc pl-5", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: `The "I'll get this one, you get the next one" approach:` }),
          " Rarely works out evenly unless you eat at the exact same places."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Massive Spreadsheets:" }),
          " Great for accountants, terrible for vacations. Who wants to pull up Google Sheets at a bar?"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Complex Apps:" }),
          " Apps that force everyone in the group to download, create an account, verify an email, and log in just to split a $20 pizza add way too much friction."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "The Solution: Keep It Simple" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 leading-relaxed mb-6", children: [
        "The best way to manage shared expenses is to have ",
        /* @__PURE__ */ jsx("strong", { children: "one single source of truth" }),
        '. Designate one person as the "treasurer" for the trip. They log every expense as it happens. At the end of the trip, the math is done automatically.'
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-teal-400 mb-3", children: "Panku App helps you do exactly this." }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-200 mb-4", children: [
          "With ",
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku" }),
          ", nobody else needs to download the app. You log the expenses offline, and when the trip is over, you instantly see who owes whom. You can even export a beautiful PDF summary to drop in the group chat."
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Start Tracking Now" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Up Next" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
        "Want to learn more? Check out our guide on the ",
        /* @__PURE__ */ jsx(Link, { to: "/blog/splitwise-alternative", className: "text-teal-400 hover:underline", children: "Best Splitwise Alternatives" }),
        " or learn ",
        /* @__PURE__ */ jsx(Link, { to: "/blog/group-trip-expense-tracking", className: "text-teal-400 hover:underline", children: "How to Track Group Expenses on Trips" }),
        "."
      ] })
    ] })
  ] });
};
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Splitwise Alternatives: Free & Offline Options",
  "author": { "@type": "Organization", "name": "Panku App" },
  "description": "Looking for the best Splitwise alternatives? Compare the top free, no-login, and offline-ready apps for splitting expenses with friends."
};
const SplitwiseAlternative = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Best Splitwise Alternatives (Free & Offline Options) | Panku" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Discover the best free and offline Splitwise alternatives. Manage group expenses and split bills easily without forcing friends to create accounts." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog/splitwise-alternative" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData) })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight", children: [
        "Best Splitwise Alternatives ",
        /* @__PURE__ */ jsx("span", { className: "text-teal-400 block mt-2", children: "(Free & Offline)" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400", children: "Why thousands are searching for simpler ways to split bills." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Why Look for an Alternative?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed mb-6", children: "Splitwise has been the industry standard for years, but recently, many users have found it bloated with ads, restricted by premium paywalls (like the limit on daily expense additions), and cumbersome because it forces everyone to create an account." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "What Makes a Great Expense App?" }),
      /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-gray-300 mb-8 list-disc pl-5", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "No mandatory accounts:" }),
          " The biggest friction point is forcing your friends to download an app and sign up."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Offline support:" }),
          " Essential for international travel or road trips with spotty service."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Free & Ad-free:" }),
          " Nobody wants to watch a 30-second ad just to calculate who owes who for tacos."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-teal-400 mb-3", children: "Enter Panku App" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-200 mb-4", children: [
          "If you're looking for the absolute most minimal, privacy-focused alternative, ",
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku App" }),
          " helps you do all of this natively. It runs right in your browser, works 100% offline via PWA, and absolutely zero log-in is required. It's the perfect drop-in replacement."
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Try Panku Free" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Related Guides" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
        "Also read about ",
        /* @__PURE__ */ jsx(Link, { to: "/blog/split-expenses-friends", className: "text-teal-400 hover:underline", children: "How to Split Expenses with Friends" }),
        " or understand the power of ",
        /* @__PURE__ */ jsx(Link, { to: "/blog/offline-expense-tracker", className: "text-teal-400 hover:underline", children: "Offline Expense Tracking" }),
        "."
      ] })
    ] })
  ] });
};
const GroupTripTracking = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Best Way to Track Group Expenses During Trips | Panku" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "A complete guide to managing shared expenses effectively during group travel. Say goodbye to spreadsheets and complicated math." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog/group-trip-expense-tracking" })
    ] }),
    /* @__PURE__ */ jsx("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight", children: [
      "Best Way to Track Group Expenses ",
      /* @__PURE__ */ jsx("span", { className: "text-teal-400 block mt-2", children: "During Trips" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed mb-6", children: "Group travel is amazing until it's time to figure out the finances..." }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 leading-relaxed mb-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku App" }),
        " helps you manage group trips effortlessly by calculating the minimal number of transactions needed to settle all debts."
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Start Tracking Now" })
    ] })
  ] });
};
const OfflineTracker = () => {
  return /* @__PURE__ */ jsxs("article", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12 prose prose-invert max-w-none font-inter animate-fade-in text-gray-300", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Offline Expense Tracker Apps (No Internet Needed) | Panku" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Why tracking expenses offline is crucial for travelers and how the right app can save your wallet overseas." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog/offline-expense-tracker" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold text-white mb-6", children: "Offline Expense Tracker Apps" }),
    /* @__PURE__ */ jsxs("p", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku App" }),
      " helps you track expenses offline securely as a PWA."
    ] })
  ] });
};
const CollegeTrip = () => {
  return /* @__PURE__ */ jsxs("article", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12 prose prose-invert max-w-none font-inter animate-fade-in text-gray-300", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "How to Split Expenses on a College Trip | Panku" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/blog/college-trip-expense-split" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold text-white mb-6", children: "College Trip Expense Guide" }),
    /* @__PURE__ */ jsxs("p", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku App" }),
      " helps you split drinks, food, and Airbnb."
    ] })
  ] });
};
const compareSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Panku vs Splitwise: Which Is Better for Group Expenses?",
  "description": "Compare Panku and Splitwise to see which expense tracker is best for your friends group. Learn about offline capabilities and no-login features."
};
const CompareSplitwise = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Panku vs Splitwise | Best Expense Tracker Comparison" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Compare Panku and Splitwise. See why Panku is the fastest, login-free, offline-ready alternative for splitting expenses with friends." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/compare/panku-vs-splitwise" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(compareSchema) })
    ] }),
    /* @__PURE__ */ jsx("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight", children: [
      "Panku vs Splitwise ",
      /* @__PURE__ */ jsx("span", { className: "text-teal-400 block mt-2", children: "Which is Better?" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed mb-6", children: "If you're looking for an app to manage expenses with friends, Splitwise is usually the first name that comes to mind. But over the years, Splitwise has introduced ads, paywalls (Splitwise Pro limits free users to adding only 3 expenses per day), and mandatory account creation." }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Feature Comparison" }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto mb-8", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/10", children: [
          /* @__PURE__ */ jsx("th", { className: "p-4 text-white font-bold", children: "Feature" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-teal-400 font-bold", children: "Panku App" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-gray-400 font-bold", children: "Splitwise" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "text-gray-300", children: [
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Account Required?" }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-teal-400 font-bold", children: "No (Zero Logins)" }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Yes (Mandatory)" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Works Offline?" }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-teal-400 font-bold", children: "Yes (100% PWA)" }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "No" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Daily Expense Limit" }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-teal-400 font-bold", children: "Unlimited" }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Limited (3 per day on free)" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Export to PDF" }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-teal-400 font-bold", children: "Yes (Free)" }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: "Pro Feature" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-teal-400 mb-3", children: "The Verdict" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-200 mb-4", children: [
          "If you need complex recurring bills for roommates spanning multiple years, Splitwise is solid. But if you're on a trip, out for dinner, or just need to split a weekend getaway without forcing everyone to download an app, ",
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku App" }),
          " is significantly faster and less intrusive."
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Try Panku Free" })
      ] })
    ] })
  ] });
};
const DinnerSplitPage = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "How to Split Dinner Bills Without Confusion | Panku Use Case" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Stop doing complex math at the dinner table. Learn how to easily split the check among a large group with the free Panku App." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/use-cases/group-dinner-bill-split" })
    ] }),
    /* @__PURE__ */ jsx("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight", children: [
      "How to Split Dinner Bills ",
      /* @__PURE__ */ jsx("span", { className: "text-teal-400 block mt-2", children: "Without Confusion" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed mb-6", children: "The waiter hands you the check, and suddenly a fun night out turns into an accounting seminar. Who ordered the extra drinks? How do we split the tip?" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "The Panku Solution" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 leading-relaxed mb-6", children: [
        "Just open ",
        /* @__PURE__ */ jsx(Link, { to: "/", className: "text-teal-400 underline decoration-teal-400/30", children: "Panku" }),
        " right from your browser. Have one person pay the bill to get the credit card points. Then, log the total expense in Panku, select exactly who was involved, and it will instantly calculate who owes what. When the night is over, export a quick screenshot to the group chat. No downloads, no accounts required."
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Start Splitting Now" })
    ] })
  ] });
};
const HowItWorksPage = () => {
  return /* @__PURE__ */ jsxs("article", { className: "prose prose-invert prose-teal max-w-none font-inter animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "How Panku Works | Fast & Free Expense Splitting" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Learn how to use Panku to split expenses with friends. No signups, works offline, and automatically calculates who owes who." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://panku.watermelonbranding.in/how-it-works" })
    ] }),
    /* @__PURE__ */ jsx("header", { className: "mb-10 text-center max-w-2xl mx-auto", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold text-white mb-6", children: "How Panku Works" }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12", children: [
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-4 text-gray-300", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Create an Event:" }),
          ' Name your trip or outing (e.g., "Miami Trip").'
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Add Members:" }),
          " Type the names of everyone involved. They don't need the app."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Log Expenses:" }),
          " Whenever someone pays for something, add it to the list. You can split bills evenly or uniquely."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Settle Up:" }),
          " Panku's algorithm automatically determines the simplest way to settle all debts with the fewest transactions possible."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors", children: "Open Web App" }) })
    ] })
  ] });
};
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(PwaApp, {})
  },
  {
    element: /* @__PURE__ */ jsx(SeoLayout, {}),
    children: [
      { path: "/about", element: /* @__PURE__ */ jsx(AboutPage, {}) },
      { path: "/how-it-works", element: /* @__PURE__ */ jsx(HowItWorksPage, {}) },
      { path: "/blog", element: /* @__PURE__ */ jsx(BlogIndex, {}) },
      { path: "/blog/split-expenses-friends", element: /* @__PURE__ */ jsx(SplitExpensesFriends, {}) },
      { path: "/blog/splitwise-alternative", element: /* @__PURE__ */ jsx(SplitwiseAlternative, {}) },
      { path: "/blog/group-trip-expense-tracking", element: /* @__PURE__ */ jsx(GroupTripTracking, {}) },
      { path: "/blog/offline-expense-tracker", element: /* @__PURE__ */ jsx(OfflineTracker, {}) },
      { path: "/use-cases/college-trip-expenses", element: /* @__PURE__ */ jsx(CollegeTrip, {}) },
      { path: "/use-cases/group-dinner-bill-split", element: /* @__PURE__ */ jsx(DinnerSplitPage, {}) },
      { path: "/compare/panku-vs-splitwise", element: /* @__PURE__ */ jsx(CompareSplitwise, {}) }
    ]
  }
];
const createRoot = ViteReactSSG(
  { routes },
  () => {
  }
);
export {
  createRoot
};
