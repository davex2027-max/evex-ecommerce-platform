import { useEffect } from 'react';

export const useConstellation = (canvasId, density, opts = {}) => {
    useEffect(() => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const settings = { linkDist: 130, speed: 0.18, mouseReact: true, ...opts };
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let nodes;
        let rafId;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(devicePixelRatio, devicePixelRatio);
            const count = Math.round((rect.width * rect.height) / density);
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * settings.speed,
                vy: (Math.random() - 0.5) * settings.speed,
                r: Math.random() * 1.6 + 0.6,
            }));
        }

        let mouse = { x: -9999, y: -9999 };
        let parent = null;
        let onMove = null;
        let onLeave = null;

        if (settings.mouseReact) {
            parent = canvas.parentElement;
            onMove = (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            };
            onLeave = () => {
                mouse.x = -9999;
                mouse.y = -9999;
            };
            parent.addEventListener('mousemove', onMove);
            parent.addEventListener('mouseleave', onLeave);
        }

        function frame() {
            const rectW = canvas.width / devicePixelRatio;
            const rectH = canvas.height / devicePixelRatio;
            ctx.clearRect(0, 0, rectW, rectH);

            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > rectW) n.vx *= -1;
                if (n.y < 0 || n.y > rectH) n.vy *= -1;
            }

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < settings.linkDist) {
                        ctx.strokeStyle = `rgba(56,189,248,${0.16 * (1 - dist / settings.linkDist)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }

                const dxm = n.x - mouse.x;
                const dym = n.y - mouse.y;
                const dm = Math.sqrt(dxm * dxm + dym * dym);
                if (dm < 140) {
                    ctx.strokeStyle = `rgba(139,92,246,${0.35 * (1 - dm / 140)})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }

                ctx.fillStyle = 'rgba(230,238,255,0.85)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            }

            if (!reduceMotion) rafId = requestAnimationFrame(frame);
        }

        resize();
        window.addEventListener('resize', resize);
        frame();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mousemove', onMove);
                parent.removeEventListener('mouseleave', onLeave);
            }
        };
    }, [canvasId, density]);
};