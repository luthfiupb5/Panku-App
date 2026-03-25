import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="text-gray-300 space-y-8 animate-fade-in font-inter leading-relaxed">
      <Helmet>
        <title>About Panku | Free Offline Expense Tracker & Bill Splitter</title>
        <meta name="description" content="Discover why we built Panku, the minimal, lightning-fast expense splitter for friends and groups. Learn more about our privacy-first, offline-ready approach." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/about" />
      </Helmet>
      
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-semibold text-teal-400 bg-teal-400/10 rounded-full ring-1 ring-inset ring-teal-400/20">
          Our Mission
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Split Expenses, <br className="hidden md:block"/> Not Friendships.
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          We believe managing group money shouldn't require mandatory logins, slow apps, or awkward conversations.
        </p>
      </header>
      
      <section className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <h2 className="text-2xl font-bold text-white mb-4">Why Panku?</h2>
        <p className="mb-4">
          Have you ever gone on a friends trip and ended up with a massive spreadsheet trying to figure out who owes who? Or used heavy apps that force everyone to create an account just to log a $10 pizza?
        </p>
        <p className="mb-4">
          Panku was built out of frustration with existing <Link to="/blog/splitwise-alternative" className="text-teal-400 hover:text-white transition-colors underline decoration-teal-400/30 underline-offset-4">Splitwise alternatives</Link>. We wanted an app that was ridiculously simple, worked entirely offline, and required zero sign-ups. You just open it and start tracking.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-[#0A1C28]/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-teal-400 mb-3">100% Offline</h3>
          <p className="text-sm">No signal on your road trip? Tracking expenses in another country? Panku stores your data right on your device as a Progressive Web App.</p>
        </div>
        <div className="bg-[#0A1C28]/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-teal-400 mb-3">No Accounts Required</h3>
          <p className="text-sm">Stop forcing friends to download apps or verify emails. One person can track the entire event effortlessly, then share a neat PDF at the end.</p>
        </div>
      </section>
      
      <div className="text-center pt-8 border-t border-white/5 mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to track your expenses?</h2>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-[#030609] uppercase tracking-widest bg-teal-gradient rounded-xl shadow-[0_0_20px_rgba(28,232,183,0.3)] hover:shadow-[0_0_30px_rgba(28,232,183,0.5)] transition-all">
          Open Panku App
        </Link>
      </div>
    </div>
  );
};
