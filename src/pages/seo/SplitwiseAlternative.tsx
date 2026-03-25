import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Splitwise Alternatives: Free & Offline Options",
  "author": { "@type": "Organization", "name": "Panku App" },
  "description": "Looking for the best Splitwise alternatives? Compare the top free, no-login, and offline-ready apps for splitting expenses with friends."
};

export const SplitwiseAlternative: React.FC = () => {
  return (
    <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
      <Helmet>
        <title>Best Splitwise Alternatives (Free & Offline Options) | Panku</title>
        <meta name="description" content="Discover the best free and offline Splitwise alternatives. Manage group expenses and split bills easily without forcing friends to create accounts." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog/splitwise-alternative" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Best Splitwise Alternatives <span className="text-teal-400 block mt-2">(Free & Offline)</span></h1>
        <p className="text-xl text-gray-400">Why thousands are searching for simpler ways to split bills.</p>
      </header>

      <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Why Look for an Alternative?</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Splitwise has been the industry standard for years, but recently, many users have found it bloated with ads, restricted by premium paywalls (like the limit on daily expense additions), and cumbersome because it forces everyone to create an account.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">What Makes a Great Expense App?</h2>
        <ul className="space-y-3 text-gray-300 mb-8 list-disc pl-5">
          <li><strong>No mandatory accounts:</strong> The biggest friction point is forcing your friends to download an app and sign up.</li>
          <li><strong>Offline support:</strong> Essential for international travel or road trips with spotty service.</li>
          <li><strong>Free & Ad-free:</strong> Nobody wants to watch a 30-second ad just to calculate who owes who for tacos.</li>
        </ul>

        <div className="bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-teal-400 mb-3">Enter Panku App</h3>
          <p className="text-gray-200 mb-4">
            If you're looking for the absolute most minimal, privacy-focused alternative, <Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku App</Link> helps you do all of this natively. It runs right in your browser, works 100% offline via PWA, and absolutely zero log-in is required. It's the perfect drop-in replacement.
          </p>
          <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Try Panku Free</Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Related Guides</h2>
        <p className="text-gray-300">
          Also read about <Link to="/blog/split-expenses-friends" className="text-teal-400 hover:underline">How to Split Expenses with Friends</Link> or understand the power of <Link to="/blog/offline-expense-tracker" className="text-teal-400 hover:underline">Offline Expense Tracking</Link>.
        </p>
      </div>
    </article>
  );
};
