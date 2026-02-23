'use client';

import LogoLoop from '@/components/LogoLoop';
import { TECH_LOGOS } from '@/constants/landing-page';

const Partners = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h3 className="text-xl font-bold text-slate-400 font-manrope uppercase tracking-[0.2em] text-sm">
                    Powered By Secure Technology
                </h3>
            </div>
            <div className="relative">
                <LogoLoop
                    logos={TECH_LOGOS}
                    speed={80}
                    direction="left"
                    logoHeight={45}
                    gap={80}
                    hoverSpeed={20}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="transparent"
                    className="text-slate-300"
                />
            </div>
        </section>
    );
};

export default Partners;
