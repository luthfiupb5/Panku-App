import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const DinnerSplitPage: React.FC = () => {
  return (
    <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
      <Helmet>
        <title>How to Split Dinner Bills Without Confusion | Panku Use Case</title>
        <meta name="description" content="Stop doing complex math at the dinner table. Learn how to easily split the check among a large group with the free Panku App." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/use-cases/group-dinner-bill-split" />
      </Helmet>
      
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">How to Split Dinner Bills <span className="text-teal-400 block mt-2">Without Confusion</span></h1>
      </header>

      <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
        <p className="text-gray-300 leading-relaxed mb-6">
          The waiter hands you the check, and suddenly a fun night out turns into an accounting seminar. Who ordered the extra drinks? How do we split the tip?
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">The Panku Solution</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Just open <Link to="/" className="text-teal-400 underline decoration-teal-400/30">Panku</Link> right from your browser. Have one person pay the bill to get the credit card points. Then, log the total expense in Panku, select exactly who was involved, and it will instantly calculate who owes what. When the night is over, export a quick screenshot to the group chat. No downloads, no accounts required.
        </p>
        <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Start Splitting Now</Link>
      </div>
    </article>
  );
};

export const HowItWorksPage: React.FC = () => {
    return (
      <article className="prose prose-invert prose-teal max-w-none font-inter animate-fade-in">
        <Helmet>
          <title>How Panku Works | Fast & Free Expense Splitting</title>
          <meta name="description" content="Learn how to use Panku to split expenses with friends. No signups, works offline, and automatically calculates who owes who." />
          <link rel="canonical" href="https://panku.watermelonbranding.in/how-it-works" />
        </Helmet>
        
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-6">How Panku Works</h1>
        </header>
  
        <div className="bg-[#0A1C28]/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-12">
          <ol className="list-decimal pl-5 space-y-4 text-gray-300">
            <li><strong>Create an Event:</strong> Name your trip or outing (e.g., "Miami Trip").</li>
            <li><strong>Add Members:</strong> Type the names of everyone involved. They don't need the app.</li>
            <li><strong>Log Expenses:</strong> Whenever someone pays for something, add it to the list. You can split bills evenly or uniquely.</li>
            <li><strong>Settle Up:</strong> Panku's algorithm automatically determines the simplest way to settle all debts with the fewest transactions possible.</li>
          </ol>
          <div className="mt-8">
            <Link to="/" className="inline-block bg-teal-500 text-[#030609] font-bold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors">Open Web App</Link>
          </div>
        </div>
      </article>
    );
  };
