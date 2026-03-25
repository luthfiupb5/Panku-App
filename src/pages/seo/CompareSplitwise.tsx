import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const compareSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Panku vs Splitwise: Which Is Better for Group Expenses?",
  "description": "Compare Panku and Splitwise to see which expense tracker is best for your friends group. Learn about offline capabilities and no-login features."
};

export const CompareSplitwise: React.FC = () => {
  return (
    <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
      <Helmet>
        <title>Panku vs Splitwise | Best Expense Tracker Comparison</title>
        <meta name="description" content="Compare Panku and Splitwise. See why Panku is the fastest, login-free, offline-ready alternative for splitting expenses with friends." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/compare/panku-vs-splitwise" />
        <script type="application/ld+json">{JSON.stringify(compareSchema)}</script>
      </Helmet>

      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Panku vs Splitwise <span className="text-teal-400 block mt-2">Which is Better?</span></h1>
      </header>

      <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
        <p className="text-gray-300 leading-relaxed mb-6">
          If you're looking for an app to manage expenses with friends, Splitwise is usually the first name that comes to mind. But over the years, Splitwise has introduced ads, paywalls (Splitwise Pro limits free users to adding only 3 expenses per day), and mandatory account creation.
        </p>
        
        <h2 className="text-2xl font-bold text-white mb-4">Feature Comparison</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-white font-bold">Feature</th>
                <th className="p-4 text-teal-400 font-bold">Panku App</th>
                <th className="p-4 text-gray-400 font-bold">Splitwise</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-white/5">
                <td className="p-4">Account Required?</td>
                <td className="p-4 text-teal-400 font-bold">No (Zero Logins)</td>
                <td className="p-4">Yes (Mandatory)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-4">Works Offline?</td>
                <td className="p-4 text-teal-400 font-bold">Yes (100% PWA)</td>
                <td className="p-4">No</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-4">Daily Expense Limit</td>
                <td className="p-4 text-teal-400 font-bold">Unlimited</td>
                <td className="p-4">Limited (3 per day on free)</td>
              </tr>
              <tr>
                <td className="p-4">Export to PDF</td>
                <td className="p-4 text-teal-400 font-bold">Yes (Free)</td>
                <td className="p-4">Pro Feature</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-teal-400 mb-3">The Verdict</h3>
          <p className="text-gray-200 mb-4">
            If you need complex recurring bills for roommates spanning multiple years, Splitwise is solid. But if you're on a trip, out for dinner, or just need to split a weekend getaway without forcing everyone to download an app, <Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku App</Link> is significantly faster and less intrusive.
          </p>
          <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Try Panku Free</Link>
        </div>
      </div>
    </article>
  );
};
