import React from 'react';
import { Link } from 'react-router-dom';
import logoDarkBg from '../assets/logo-darkbg.png';

export const SeoHeader: React.FC = () => {
    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-white/[0.03]"
            style={{
                backgroundColor: 'rgba(5, 8, 12, 0.65)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
            }}
        >
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={logoDarkBg}
                        alt="Panku Logo"
                        className="h-8 object-contain drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]"
                    />
                </Link>
                <Link
                    to="/"
                    className="text-sm font-medium text-teal-400 hover:text-white transition-colors"
                >
                    Open App →
                </Link>
            </div>
        </header>
    );
};
