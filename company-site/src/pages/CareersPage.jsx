import { Link } from 'react-router-dom';
import { Rocket, Users, GraduationCap, HeartHandshake, ArrowRight, Briefcase, Send } from 'lucide-react';
import { CONTACT } from '../config';
import { useScrollReveal } from '../hooks/useScrollReveal';

const PERKS = [
    {
        icon: Rocket,
        title: 'Build Real Products',
        text: 'Ship platforms used by real people — from the first line of code to launch.',
    },
    {
        icon: Users,
        title: 'Collaborative Culture',
        text: 'Work alongside developers, designers, educators, and entrepreneurs who share your passion.',
    },
    {
        icon: GraduationCap,
        title: 'Learn & Grow',
        text: 'We invest in your skills through mentorship, new technologies, and real challenges.',
    },
    {
        icon: HeartHandshake,
        title: 'Meaningful Impact',
        text: 'Your work connects communities, empowers businesses, and shapes the future of digital Africa.',
    },
];

const ROLES = [
    { title: 'Frontend Developer', tag: 'React / JavaScript', type: 'Remote' },
    { title: 'Backend Developer', tag: 'Node.js / Databases', type: 'Remote' },
    { title: 'UI/UX Designer', tag: 'Product Design', type: 'Remote' },
    { title: 'Content Creator', tag: 'Tech & Education', type: 'Remote' },
    { title: 'Business Development', tag: 'Partnerships & Sales', type: 'Remote' },
    { title: 'Mobile Developer', tag: 'Android / iOS', type: 'Remote' },
];

const applyHref = (role) => {
    const subject = encodeURIComponent(`Application — ${role}`);
    const body = encodeURIComponent('Hi EVEX Team,\n\nI would love to apply for this role. Here is a bit about me:\n\nName:\nExperience:\nLink to portfolio/CV:');
    return `mailto:${CONTACT.careersEmail}?subject=${subject}&body=${body}`;
};

const CareersPage = () => {
    const revealRef = useScrollReveal();

    return (
        <div ref={revealRef}>
            <section id="page-hero" style={{ paddingTop: 180 }}>
                <div className="section-inner">
                    <span className="eyebrow reveal in">Join the team</span>
                    <h1 className="section-title reveal in" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', maxWidth: 760 }}>
                        Great technology is built by <span className="grad-text">great people.</span>
                    </h1>
                    <p className="section-text reveal in" style={{ maxWidth: 640 }}>
                        EVEX is always looking for passionate developers, designers, educators, and builders who want
                        to create digital products that matter. If you love what you do, there's a place for you here.
                    </p>
                    <div className="hero-actions reveal in">
                        <a href={applyHref(ROLES[0].title)} className="btn-primary" style={{ textDecoration: 'none' }}>
                            Apply Now <ArrowRight size={16} />
                        </a>
                        <Link to="/contact" className="btn-ghost">Ask a Question</Link>
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner">
                    <div className="section-head reveal">
                        <span className="eyebrow">Why join EVEX?</span>
                        <h2 className="section-title">More than a job — a <span className="grad-text">mission.</span></h2>
                    </div>
                    <div className="grid-4">
                        {PERKS.map((p) => (
                            <div className="feature-card reveal" key={p.title}>
                                <div className="feature-icon"><p.icon size={22} /></div>
                                <h3 style={{ fontSize: '1.05rem', margin: '0 0 10px' }}>{p.title}</h3>
                                <p className="section-text" style={{ fontSize: '.9rem' }}>{p.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner">
                    <div className="section-head reveal">
                        <span className="eyebrow">Open roles</span>
                        <h2 className="section-title">We're <span className="grad-text">hiring.</span></h2>
                        <p className="section-text">
                            Don't see your role? Email us anyway — great people always find a way in.
                        </p>
                    </div>
                    <div className="roles-list">
                        {ROLES.map((r) => (
                            <div className="role-card reveal" key={r.title}>
                                <div className="role-info">
                                    <div className="role-icon"><Briefcase size={20} /></div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px' }}>{r.title}</h3>
                                        <span className="role-tag">{r.tag}</span>
                                        <span className="role-tag">{r.type}</span>
                                    </div>
                                </div>
                                <a href={applyHref(r.title)} className="btn-ghost" style={{ textDecoration: 'none', flexShrink: 0 }}>
                                    Apply <Send size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner" style={{ textAlign: 'center' }}>
                    <div className="coming-soon reveal" style={{ maxWidth: 720, margin: '0 auto' }}>
                        <div className="eco-icon"><Send size={24} /></div>
                        <h2 className="section-title">Don't see the right role?</h2>
                        <p className="section-text" style={{ maxWidth: 520, margin: '0 auto 28px' }}>
                            Send your CV to {CONTACT.careersEmail} with a note about how you'd like to contribute — we read every message.
                        </p>
                        <a href={`mailto:${CONTACT.careersEmail}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                            Email Your CV <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;