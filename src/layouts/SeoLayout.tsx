import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { SeoHeader } from '../components/SeoHeader';
import { InstallPrompt } from '../components/InstallPrompt';

export const SeoLayout: React.FC = () => {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-transparent flex flex-col relative z-0">
      {/* Global Animated Background Mesh */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14B8A6] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#2DD4BF] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-15%] left-[10%] w-[600px] h-[600px] bg-[#38F2C2] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.03] animate-blob animation-delay-4000" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0A1C28] rounded-full mix-blend-overlay filter blur-[80px] opacity-[0.8]" />
        <div className="absolute inset-0 bg-[#05080c] mix-blend-overlay opacity-90"></div>
      </div>

      <SeoHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 pb-32">
        <Outlet />
      </main>

      {/* SEO Optimized Footer */}
      <footer className="w-full mt-auto py-12 px-6 border-t border-white/5 bg-[#030609]/80 backdrop-blur-md relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold mb-4 font-inter text-lg">Panku App</h3>
            <p className="text-gray-400 mb-4">
              Split expenses with friends easily. The best offline expense tracker for trips, outings, and events.
            </p>
            <Link to="/" className="text-teal-400 hover:text-white font-semibold transition-colors">
              Open Web App &rarr;
            </Link>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Features & Utility</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors">How It Works</Link></li>
              <li><Link to="/use-cases/college-trip-expenses" className="text-gray-400 hover:text-teal-400 transition-colors">College Trip Expenses</Link></li>
              <li><Link to="/use-cases/group-dinner-bill-split" className="text-gray-400 hover:text-teal-400 transition-colors">Split Dinner Bills</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Top Guides</h4>
            <ul className="space-y-3">
              <li><Link to="/blog/split-expenses-friends" className="text-gray-400 hover:text-teal-400 transition-colors">How to Split Expenses with Friends</Link></li>
              <li><Link to="/blog/splitwise-alternative" className="text-gray-400 hover:text-teal-400 transition-colors">Best Splitwise Alternatives</Link></li>
              <li><Link to="/blog/group-trip-expense-tracking" className="text-gray-400 hover:text-teal-400 transition-colors">Group Trip Expense Guide</Link></li>
              <li><Link to="/blog/offline-expense-tracker" className="text-gray-400 hover:text-teal-400 transition-colors">Offline Expense Tracker</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Panku App. All rights reserved.
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
};
