import { Smartphone, GraduationCap, ChartSpline, ArrowRight } from 'lucide-react';
import { LINKS } from '../config';

const PRODUCTS = [
    {
        icon: Smartphone,
        title: 'EVEX Super App',
        text: 'A powerful digital ecosystem designed to bring multiple everyday digital experiences together in one intelligent platform.',
        href: LINKS.superApp,
        cta: 'Explore Super App',
        status: 'Phase 2',
    },
    {
        icon: GraduationCap,
        title: 'EVEX Learning Hub',
        text: 'A modern learning platform designed to help people develop digital skills, discover technology, and prepare for the future.',
        href: LINKS.learningHub,
        cta: 'Start Learning',
        status: 'Phase 3',
    },
    {
        icon: ChartSpline,
        title: 'EVEX Business Platform',
        text: 'A digital platform designed to help businesses operate smarter, connect with customers, and unlock new opportunities.',
        href: LINKS.businessPlatform,
        cta: 'Explore Business',
        status: 'Live',
    },
];

const Ecosystem = () => (
    <section id="ecosystem">
        <div className="section-inner">
            <div className="section-head reveal">
                <span className="eyebrow">The EVEX Ecosystem</span>
                <h2 className="section-title">
                    One ecosystem. <span className="grad-text">Endless possibilities.</span>
                </h2>
                <p className="section-text">Explore the digital platforms we're building to shape the future.</p>
            </div>
            <div className="grid-3">
                {PRODUCTS.map((p) => (
                    <div className="eco-card reveal" key={p.title}>
                        <div className="eco-icon"><p.icon size={24} /></div>
                        <div className="eco-status-row">
                            <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px' }}>{p.title}</h3>
                            <span className={`eco-status eco-status-${p.status === 'Live' ? 'live' : 'soon'}`}>{p.status}</span>
                        </div>
                        <p className="section-text" style={{ fontSize: '.94rem' }}>{p.text}</p>
                        <a href={p.href} className="eco-link">
                            {p.cta} <ArrowRight size={15} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Ecosystem;