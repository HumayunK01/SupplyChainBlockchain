'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999] p-3 rounded-full glass-dark text-white hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 group transition-all duration-300"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-1" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
