'use client';

import { FLOW_DATA } from '@/constants/landing-page';

const IntegrationsFlow = () => {
    return (
        <section className="py-16 md:py-24 px-6 font-manrope">
            <div className="container mx-auto bg-white text-slate-900 rounded-[2rem] py-16 md:py-20 px-6 md:px-12 overflow-hidden border border-slate-100 shadow-sm relative">
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

                <div className="relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold tracking-widest uppercase mb-4">
                            Architecture
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900">Seamless Integration</h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
                            Visualize your product's journey from raw materials to the end consumer, all secured on the blockchain.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-4 relative">
                            {FLOW_DATA.map((item, index) => (
                                <div key={item.step} className="flex flex-col items-center relative z-10 group">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-[2rem] flex items-center justify-center text-slate-900 mb-4 md:mb-6 shadow-sm border border-slate-200 group-hover:border-slate-300 transition-all transform group-hover:-translate-y-2 duration-300">
                                        <item.icon className="w-7 h-7 md:w-8 md:h-8" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-900 mb-1">{item.label}</div>
                                        <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Step {item.step}</div>
                                    </div>
                                    {index < FLOW_DATA.length - 1 && (
                                        <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-slate-200 -z-10 group-hover:bg-slate-300 transition-colors"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntegrationsFlow;
