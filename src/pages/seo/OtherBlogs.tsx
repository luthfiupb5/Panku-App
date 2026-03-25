import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const GroupTripTracking: React.FC = () => {
  return (
    <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
      <Helmet>
        <title>Best Way to Track Group Expenses During Trips | Panku</title>
        <meta name="description" content="A complete guide to managing shared expenses effectively during group travel. Say goodbye to spreadsheets and complicated math." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog/group-trip-expense-tracking" />
      </Helmet>
      
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Best Way to Track Group Expenses <span className="text-teal-400 block mt-2">During Trips</span></h1>
      </header>

      <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
        <p className="text-gray-300 leading-relaxed mb-6">Group travel is amazing until it's time to figure out the finances...</p>
        
        {/* Shortened for brevity, representing the format */}
        <p className="text-gray-300 leading-relaxed mb-6">
          <Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku App</Link> helps you manage group trips effortlessly by calculating the minimal number of transactions needed to settle all debts.
        </p>
        <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Start Tracking Now</Link>
      </div>
    </article>
  );
};

export const OfflineTracker: React.FC = () => {
  return (
    <article className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12 prose prose-invert max-w-none font-inter animate-fade-in text-gray-300">
      <Helmet>
        <title>Offline Expense Tracker Apps (No Internet Needed) | Panku</title>
        <meta name="description" content="Why tracking expenses offline is crucial for travelers and how the right app can save your wallet overseas." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog/offline-expense-tracker" />
      </Helmet>
      <h1 className="text-4xl font-extrabold text-white mb-6">Offline Expense Tracker Apps</h1>
      <p className="mb-6"><Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku App</Link> helps you track expenses offline securely as a PWA.</p>
    </article>
  );
};

export const CollegeTrip: React.FC = () => {
  return (
    <article className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12 prose prose-invert max-w-none font-inter animate-fade-in text-gray-300">
      <Helmet>
        <title>How to Split Expenses on a College Trip | Panku</title>
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog/college-trip-expense-split" />
      </Helmet>
      <h1 className="text-4xl font-extrabold text-white mb-6">College Trip Expense Guide</h1>
      <p className="mb-6"><Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku App</Link> helps you split drinks, food, and Airbnb.</p>
    </article>
  );
};
