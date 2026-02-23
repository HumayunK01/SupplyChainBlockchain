'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';

import TextType from '@/components/TextType';
import SplitText from '@/components/SplitText';
import AnimatedContent from '@/components/AnimatedContent';

const Hero = () => {
    const router = useRouter();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Safe. Clear. Open.
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 md:mb-8 leading-[1.2] font-manrope tracking-tight"
                >
                    <TextType
                        text={["Building Trust in\nthe Medical Supply Chain", "Tracking Every Step of\nthe Medicine Journey!"]}
                        typingSpeed={60}
                        pauseDuration={2000}
                        deletingSpeed={30}
                        showCursor
                        cursorClassName="text-slate-400"
                        initialDelay={2200}
                    />
                </motion.h1>

                <SplitText
                    text="Keep your supply chain safe with our easy-to-use tracking platform. Follow every medicine from the factory to the patient."
                    className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
                    delay={20}
                    duration={1}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-50px"
                    textAlign="center"
                    tag="p"
                    animationDelay={2.4}
                />

                <AnimatedContent
                    distance={100}
                    direction="vertical"
                    duration={0.8}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0.1}
                    delay={2.9}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/roles')}
                        className="btn-primary w-full sm:w-auto text-base py-3.5 px-8 flex items-center justify-center gap-2 group"
                    >
                        <span>Get Started</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/track')}
                        className="btn-secondary w-full sm:w-auto text-base py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 group"
                    >
                        <Search size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                        <span>Track Medicine</span>
                    </motion.button>
                </AnimatedContent>
            </div>
        </section>
    );
};

export default Hero;
