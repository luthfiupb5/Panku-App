import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const structuredData = {
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

export const SplitExpensesFriends: React.FC = () => {
  return (
    <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
      <Helmet>
        <title>How to Split Expenses with Friends (Without Awkwardness) | Panku</title>
        <meta name="description" content="Learn the best ways to track and split expenses with friends without ruining your relationship. Try the easiest Splitwise alternative." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog/split-expenses-friends" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">How to Split Expenses with Friends <span className="text-teal-400 block mt-2">(Without Awkwardness)</span></h1>
        <p className="text-xl text-gray-400">Money talks shouldn't ruin your weekend getaway.</p>
      </header>

      <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Awkward Money Problem</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          You're at a group dinner. The bill arrives, and suddenly everyone is doing mental math. Someone pays, and then you hear the dreaded phrase: "I'll Venmo you." Three weeks later, you're still waiting for that Venmo, and it's too awkward to bring it up. We've all been there.
        </p>
        
        <h2 className="text-2xl font-bold text-white mb-4">Common Mistakes When Splitting Bills</h2>
        <ul className="space-y-3 text-gray-300 mb-8 list-disc pl-5">
          <li><strong>The "I'll get this one, you get the next one" approach:</strong> Rarely works out evenly unless you eat at the exact same places.</li>
          <li><strong>Massive Spreadsheets:</strong> Great for accountants, terrible for vacations. Who wants to pull up Google Sheets at a bar?</li>
          <li><strong>Complex Apps:</strong> Apps that force everyone in the group to download, create an account, verify an email, and log in just to split a $20 pizza add way too much friction.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mb-4">The Solution: Keep It Simple</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          The best way to manage shared expenses is to have <strong>one single source of truth</strong>. Designate one person as the "treasurer" for the trip. They log every expense as it happens. At the end of the trip, the math is done automatically.
        </p>

        <div className="bg-teal-900/20 border border-teal-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-teal-400 mb-3">Panku App helps you do exactly this.</h3>
          <p className="text-gray-200 mb-4">
            With <Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku</Link>, nobody else needs to download the app. You log the expenses offline, and when the trip is over, you instantly see who owes whom. You can even export a beautiful PDF summary to drop in the group chat.
          </p>
          <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Start Tracking Now</Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Up Next</h2>
        <p className="text-gray-300">
          Want to learn more? Check out our guide on the <Link to="/blog/splitwise-alternative" className="text-teal-400 hover:underline">Best Splitwise Alternatives</Link> or learn <Link to="/blog/group-trip-expense-tracking" className="text-teal-400 hover:underline">How to Track Group Expenses on Trips</Link>.
        </p>
      </div>
    </article>
  );
};
