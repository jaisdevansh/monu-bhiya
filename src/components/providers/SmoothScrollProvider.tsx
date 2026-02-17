'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Check if Lenis instance already exists to prevent multiple initializations
        if (!lenisRef.current) {
            const lenis = new Lenis({
                duration: 1.8,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.1,
                touchMultiplier: 2,
                infinite: false,
                lerp: 0.05,
            });

            lenisRef.current = lenis;

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
        }

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    return <>{children}</>;
}
