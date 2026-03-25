import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    slug: 'split-expenses-friends',
    title: 'How to Split Expenses with Friends (Without Awkwardness)',
    description: 'Learn the best strategies to split bills fairly among friends without ruining relationships. See how modern apps like Panku solve this.',
  },
  {
    slug: 'splitwise-alternative',
    title: 'Best Splitwise Alternatives: Free & Offline Options',
    description: 'Looking for a Splitwise alternative? Compare the best apps to split expenses with friends without mandatory accounts or logins.',
  },
  {
    slug: 'group-trip-expense-tracking',
    title: 'Best Way to Track Group Expenses During Trips',
    description: 'A complete guide to managing shared expenses effectively during group travel. Say goodbye to spreadsheets.',
  },
  {
    slug: 'offline-expense-tracker',
    title: 'Offline Expense Tracker Apps (No Internet Needed)',
    description: 'Why tracking expenses offline is crucial for travelers and how the right app can save your wallet overseas.',
  },
  {
    slug: 'college-trip-expense-split',
    title: 'How to Split Expenses on a College Trip',
    description: 'The ultimate budget guide for students. Easily track your shared costs so nobody overpays.',
  }
];

export const BlogIndex: React.FC = () => {
  return (
    <div className="text-gray-300 font-inter animate-fade-in">
      <Helmet>
        <title>Panku Blog | Guides on Splitting Expenses & Managing Money</title>
        <meta name="description" content="Read expert guides on how to split expenses with friends, track group trips, and find the best Splitwise alternatives via the Panku Blog." />
        <link rel="canonical" href="https://panku.watermelonbranding.in/blog" />
      </Helmet>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Guides & Resources</h1>
        <p className="text-lg text-gray-400">Everything you need to know about managing shared finances.</p>
      </header>

      <div className="space-y-6">
        {BLOG_POSTS.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
            <article className="p-6 bg-[#0A1C28]/40 border border-white/5 rounded-2xl transition-all hover:bg-[#0A1C28]/80 hover:border-teal-400/30">
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
              <div className="mt-4 text-teal-400 text-sm font-semibold flex items-center">
                Read full article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};
