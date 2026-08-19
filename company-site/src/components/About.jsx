import { Lightbulb, Workflow, Globe } from 'lucide-react';

const FEATURES = [
    {
        icon: Lightbulb,
        title: 'Innovation',
        text: 'Turning bold ideas into practical digital solutions.',
    },
    {
        icon: Workflow,
        title: 'Automation',
        text: 'Building intelligent systems that simplify processes and improve productivity.',
    },
    {
        icon: Globe,
        title: 'Impact',
        text: 'Creating technology that connects, educates, and empowers communities.',
    },
];

const About = () => (
    <section id="about">
        <div className="section-inner">
            <div className="section-head reveal">
                <span className="eyebrow">About EVEX</span>
                <h2 className="section-title">
                    We are building more than <span className="grad-text">software.</span>
                </h2>
                <p className="section-text">
                    EVEX Digital Company is a technology-driven ecosystem focused on creating innovative platforms
                    that solve real-world problems. We combine technology, creativity, automation, and education to
                    build digital experiences that make life and business better.
                </p>
            </div>
            <div className="grid-3">
                {FEATURES.map((f) => (
                    <div className="feature-card reveal" key={f.title}>
                        <div className="feature-icon"><f.icon size={22} /></div>
                        <h3 style={{ fontSize: '1.15rem', margin: '0 0 10px' }}>{f.title}</h3>
                        <p className="section-text" style={{ fontSize: '.94rem' }}>{f.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default About;