import { Link } from 'react-router-dom';
import { Target, Eye, ArrowRight, Compass, Users, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const STATS = [
    { value: '5', label: 'Roadmap Phases' },
    { value: '3', label: 'Products in the Ecosystem' },
    { value: '1', label: 'Live Platform' },
    { value: '∞', label: 'Possibilities' },
];

const VALUES = [
    {
        icon: Sparkles,
        title: 'Innovation First',
        text: 'We experiment, iterate, and ship bold ideas that challenge the status quo.',
    },
    {
        icon: Users,
        title: 'People-Centered',
        text: 'Every product we build is designed to make life and business better for real people.',
    },
    {
        icon: Zap,
        title: 'Speed & Agility',
        text: 'We move fast, learn quickly, and adapt to what the world needs.',
    },
    {
        icon: ShieldCheck,
        title: 'Trust & Integrity',
        text: 'We build secure, honest, and reliable digital experiences you can depend on.',
    },
];

const ROADMAP = [
    { phase: 'Phase 1', title: 'Foundation', text: 'The EVEX brand, identity, and company website — the launchpad for everything we build.' },
    { phase: 'Phase 2', title: 'EVEX Super App', text: 'A connected ecosystem bringing everyday digital experiences into one intelligent platform.' },
    { phase: 'Phase 3', title: 'EVEX Learning Hub', text: 'A modern platform for digital skills, technology discovery, and future-ready education.' },
    { phase: 'Phase 4', title: 'EVEX Business Platform', text: 'Tools that help businesses operate smarter, reach customers, and unlock new opportunities — live today.' },
    { phase: 'Phase 5', title: 'Growth & Scale', text: 'Expanding the ecosystem, growing the community, and powering the next generation of digital builders.' },
];

const AboutPage = () => {
    const revealRef = useScrollReveal();

    return (
        <div ref={revealRef}>
            <section id="page-hero" style={{ paddingTop: 180 }}>
                <div className="section-inner">
                    <span className="eyebrow reveal in">About EVEX</span>
                    <h1 className="section-title reveal in" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', maxWidth: 720 }}>
                        A digital company with a <span className="grad-text">bigger vision.</span>
                    </h1>
                    <p className="section-text reveal in" style={{ maxWidth: 680 }}>
                        EVEX Digital Company is a technology-driven ecosystem creating innovative platforms that solve
                        real-world problems. We combine technology, creativity, automation, and education to build
                        digital experiences that make life and business better.
                    </p>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner stats-row">
                    {STATS.map((s) => (
                        <div className="stat-card reveal" key={s.label}>
                            <div className="stat-value grad-text">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner grid-2-even">
                    <div className="feature-card reveal">
                        <div className="feature-icon"><Target size={22} /></div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px' }}>Our Mission</h3>
                        <p className="section-text">
                            To build intelligent digital platforms that connect people, educate communities, empower
                            businesses, and transform bold ideas into reality.
                        </p>
                    </div>
                    <div className="feature-card reveal">
                        <div className="feature-icon"><Eye size={22} /></div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px' }}>Our Vision</h3>
                        <p className="section-text">
                            To become a leading digital ecosystem that shapes the future of technology in Africa and
                            beyond — one innovative platform at a time.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner">
                    <div className="section-head reveal">
                        <span className="eyebrow">What we stand for</span>
                        <h2 className="section-title">Our <span className="grad-text">values.</span></h2>
                    </div>
                    <div className="grid-4">
                        {VALUES.map((v) => (
                            <div className="feature-card reveal" key={v.title}>
                                <div className="feature-icon"><v.icon size={22} /></div>
                                <h3 style={{ fontSize: '1.05rem', margin: '0 0 10px' }}>{v.title}</h3>
                                <p className="section-text" style={{ fontSize: '.9rem' }}>{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner">
                    <div className="section-head reveal">
                        <span className="eyebrow">The journey</span>
                        <h2 className="section-title">Our <span className="grad-text">roadmap.</span></h2>
                        <p className="section-text">Every phase moves us closer to a complete digital ecosystem.</p>
                    </div>
                    <div className="roadmap">
                        {ROADMAP.map((r, i) => (
                            <div className={`roadmap-item reveal ${i === 3 ? 'roadmap-live' : ''}`} key={r.phase}>
                                <div className="roadmap-dot"></div>
                                <div className="roadmap-phase">{r.phase}</div>
                                <h3 style={{ fontSize: '1.1rem', margin: '8px 0 8px' }}>{r.title}</h3>
                                <p className="section-text" style={{ fontSize: '.92rem' }}>{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner" style={{ textAlign: 'center' }}>
                    <div className="coming-soon reveal" style={{ maxWidth: 720, margin: '0 auto' }}>
                        <div className="eco-icon"><Compass size={24} /></div>
                        <h2 className="section-title">Come build the future <span className="grad-text">with us.</span></h2>
                        <p className="section-text" style={{ maxWidth: 520, margin: '0 auto 28px' }}>
                            Whether you want to collaborate, invest, learn, or join the team — there's a place for you at EVEX.
                        </p>
                        <div className="hero-actions" style={{ justifyContent: 'center' }}>
                            <Link to="/careers" className="btn-primary" style={{ textDecoration: 'none' }}>
                                Join the Team <ArrowRight size={16} />
                            </Link>
                            <Link to="/contact" className="btn-ghost">Get in Touch</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;