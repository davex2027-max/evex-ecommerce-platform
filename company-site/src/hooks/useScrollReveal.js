import { useEffect, useRef } from 'react';

export const useScrollReveal = (threshold = 0.15) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const els = containerRef.current?.querySelectorAll('.reveal');
        if (!els || els.length === 0) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            els.forEach((el) => el.classList.add('in'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in');
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [threshold]);

    return containerRef;
};