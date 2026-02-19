'use client';

import { motion } from 'framer-motion';
import { STATS_DATA } from '@/constants/landing-page';

const Stats = () => {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {STATS_DATA.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all"
                        >
                            <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-sm border border-slate-100">
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 font-manrope tracking-tight">{stat.value}</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
