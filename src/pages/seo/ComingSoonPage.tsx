import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ComingSoonPage: React.FC = () => {
    return (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh] text-center">
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-[#38F2C2]/20 blur-3xl rounded-full" />
                <div className="relative bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 flex items-center justify-center glow-teal">
                    <Rocket size={64} className="text-[#38F2C2] drop-shadow-[0_0_15px_rgba(56,242,194,0.5)]" />
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-black text-[#E8EDF2] tracking-tight mb-4"
            >
                Launching <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#38F2C2]">Soon</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="text-lg text-[#9AA4AF] max-w-lg mx-auto mb-12 flex items-center justify-center gap-2"
            >
                We're currently building something amazing. Panku will be fully available very soon! 
                <Sparkles size={20} className="text-[#38F2C2]" />
            </motion.p>

        </div>
    );
};
