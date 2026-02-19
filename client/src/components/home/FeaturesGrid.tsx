'use client';

import { useRouter } from 'next/navigation';
import { FEATURES_DATA } from '@/constants/landing-page';

const FeaturesGrid = () => {
    const router = useRouter();

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-manrope">Everything you need</h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
                        Our platform offers a comprehensive suite of tools to manage every aspect of your decentralized supply chain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {FEATURES_DATA.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className="group relative bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Grid Background */}
                            <div
                                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, #94a3b8 1px, transparent 1px),
                                        linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                                    `,
                                    backgroundSize: '32px 32px',
                                }}
                            />
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                    <div className="inline-flex items-center text-slate-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                                        Get Started
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
