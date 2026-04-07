import { Outlet, type RouteObject } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { PwaApp } from './PwaApp';
import { SeoLayout } from './layouts/SeoLayout';
import { AboutPage } from './pages/seo/AboutPage';
import { BlogIndex } from './pages/seo/BlogIndex';
import { SplitExpensesFriends } from './pages/seo/SplitExpensesFriends';
import { SplitwiseAlternative } from './pages/seo/SplitwiseAlternative';
import { GroupTripTracking, OfflineTracker, CollegeTrip } from './pages/seo/OtherBlogs';
import { CompareSplitwise } from './pages/seo/CompareSplitwise';
import { DinnerSplitPage, HowItWorksPage } from './pages/seo/UseCases';
import { ComingSoonPage } from './pages/seo/ComingSoonPage';

const RootLayout = () => (
    <>
        <Outlet />
        <SpeedInsights />
    </>
);

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <PwaApp />
            },
            {
                element: <SeoLayout />,
                children: [
                    { path: '/about', element: <AboutPage /> },
                    { path: '/how-it-works', element: <HowItWorksPage /> },
                    { path: '/blog', element: <BlogIndex /> },
                    { path: '/blog/split-expenses-friends', element: <SplitExpensesFriends /> },
                    { path: '/blog/splitwise-alternative', element: <SplitwiseAlternative /> },
                    { path: '/blog/group-trip-expense-tracking', element: <GroupTripTracking /> },
                    { path: '/blog/offline-expense-tracker', element: <OfflineTracker /> },
                    { path: '/use-cases/college-trip-expenses', element: <CollegeTrip /> },
                    { path: '/use-cases/group-dinner-bill-split', element: <DinnerSplitPage /> },
                    { path: '/compare/panku-vs-splitwise', element: <CompareSplitwise /> },
                    { path: '/comingsoon', element: <ComingSoonPage /> },
                    { path: '/comingsoon/', element: <ComingSoonPage /> },
                ]
            }
        ]
    }
];
