import React from 'react';
import DotGrid from './DotGrid';
import GridBackground from './GridBackground';

const GlobalBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 pointer-events-none">
            {/* Boxes background for mobile */}
            <GridBackground />

            {/* Interactive DotGrid for desktop */}
            <div className="hidden md:block absolute inset-0 opacity-40">
                <DotGrid
                    dotSize={3}
                    gap={25}
                    baseColor="#94a3b8"
                    activeColor="#0f172a"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                    className="w-full h-full"
                />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/50" />
        </div>
    );
};

export default GlobalBackground;
