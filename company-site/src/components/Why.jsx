import { BrainCircuit, Link2, Sparkles, Rocket } from 'lucide-react';

const REASONS = [
    {
        icon: BrainCircuit,
        title: 'Intelligent',
        text: 'We use modern technology and automation to create smarter digital experiences.',
    },
    {
        icon: Link2,
        title: 'Connected',
        text: 'We build platforms that bring people, businesses, and opportunities together.',
    },
    {
        icon: Sparkles,
        title: 'Creative',
        text: 'We transform ideas into engaging and useful digital products.',
    },
    {
        icon: Rocket,
        title: 'Future-Ready',
        text: 'We build with tomorrow\'s technology and challenges in mind.',
    },
];

const Why = () => (
    <section id="why">
        <div className="section-inner">
            <div className="section-head reveal">
                <span className="eyebrow">Why EVEX</span>
                <h2 className="section-title">
                    Why <span className="grad-text">EVEX?</span>
                </h2>
            </div>
            <div className="grid-4" style={{ borderBottom: '1px solid var(--line)' }}>
                {REASONS.map((r) => (
                    <div className="why-item reveal" key={r.title}>
                        <r.icon size={24} />
                        <h3 style={{ fontSize: '1.05rem', margin: '16px 0 8px' }}>{r.title}</h3>
                        <p className="section-text" style={{ fontSize: '.9rem' }}>{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Why;