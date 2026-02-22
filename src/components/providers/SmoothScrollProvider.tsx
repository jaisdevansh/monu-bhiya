'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const initLenis = () => {
            if (lenisRef.current) return;

            // Option A: Disable Lenis and use native scroll for mobile screens (<768px)
            if (window.innerWidth < 768) {
                return;
            }

            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 0, // Fallback/enforce to avoid touch hijacking if any
            });

            lenisRef.current = lenis;

            function raf(time: number) {
                lenis.raf(time);
                requestRef.current = requestAnimationFrame(raf);
            }

            requestRef.current = requestAnimationFrame(raf);
        };

        const handleResize = () => {
            if (window.innerWidth < 768 && lenisRef.current) {
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = null;
                }
                lenisRef.current.destroy();
                lenisRef.current = null;
            } else if (window.innerWidth >= 768 && !lenisRef.current) {
                initLenis();
            }
        };

        initLenis();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    return <>{children}</>;
}
