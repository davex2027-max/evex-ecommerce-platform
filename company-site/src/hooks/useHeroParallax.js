import { useEffect } from 'react';

export const useHeroParallax = () => {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const wrap = document.getElementById('hero-visual-wrap');
        const frame = document.getElementById('hero-visual-frame');
        if (!wrap || !frame) return;
        const panels = wrap.querySelectorAll('.panel-slot');

        const onMove = (e) => {
            const rect = wrap.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            frame.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
            panels.forEach((p, i) => {
                const depth = 14 + i * 8;
                p.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
            });
        };

        const onLeave = () => {
            frame.style.transform = 'rotateY(0deg) rotateX(0deg)';
            panels.forEach((p) => {
                p.style.transform = '';
            });
        };

        wrap.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', onLeave);
        return () => {
            wrap.removeEventListener('mousemove', onMove);
            wrap.removeEventListener('mouseleave', onLeave);
        };
    }, []);
};