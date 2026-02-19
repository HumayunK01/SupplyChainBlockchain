'use client';

import { useEffect } from 'react';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        (async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            const locomotiveScroll = new LocomotiveScroll({
                lenisOptions: {
                    lerp: 0.1,
                    duration: 1.2,
                    smoothWheel: true,
                }
            });
        })();
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
