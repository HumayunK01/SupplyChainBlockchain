'use client';

import { useEffect } from 'react';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        let locomotiveScroll: any;
        (async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            locomotiveScroll = new LocomotiveScroll({
                lenisOptions: {
                    lerp: 0.1,
                    duration: 1.2,
                    smoothWheel: true,
                }
            });
        })();

        return () => {
            if (locomotiveScroll) locomotiveScroll.destroy();
        }
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
