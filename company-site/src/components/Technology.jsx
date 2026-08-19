import { ArrowRight } from 'lucide-react';

const TAGS = [
    'AI',
    'Automation',
    'Web Technology',
    'Mobile Applications',
    'Cloud',
    'Digital Education',
    'Business Technology',
    'Data',
];

const Technology = () => (
    <section id="technology">
        <div className="section-inner">
            <div className="section-head reveal">
                <span className="eyebrow">Technology</span>
                <h2 className="section-title">
                    Powered by technology. <span className="grad-text">Driven by vision.</span>
                </h2>
            </div>
            <div className="tech-tags reveal">
                {TAGS.map((t) => (
                    <span className="tech-tag" key={t}>{t}</span>
                ))}
            </div>
            <p className="section-text reveal" style={{ maxWidth: 640 }}>
                Technology is changing the way the world learns, works, communicates, and does business. EVEX exists
                to help people and organizations take advantage of that transformation.
            </p>
            <a href="#ecosystem" className="eco-link reveal" style={{ marginTop: 26 }}>
                Discover Our Technology <ArrowRight size={15} />
            </a>
        </div>
    </section>
);

export default Technology;