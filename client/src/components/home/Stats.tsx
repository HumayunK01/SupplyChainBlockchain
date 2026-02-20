'use client';

import { motion } from 'framer-motion';
import { STATS_DATA } from '@/constants/landing-page';

const Stats = () => {
    return (
        <section className="py-8 md:py-12 px-6 font-manrope">
            <div className="container mx-auto bg-white text-slate-900 rounded-[2rem] py-12 md:py-16 px-6 md:px-12 overflow-hidden border border-slate-100 shadow-sm relative">
                {/* Subtle Decorative Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>

                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #94a3b8 1px, transparent 1px),
                            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
                    {STATS_DATA.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center justify-center text-center transition-all"
                        >
                            <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center mb-5 shrink-0 shadow-sm border border-slate-100">
                                <stat.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900 font-manrope tracking-tight mb-1">{stat.value}</div>
                                <div className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
