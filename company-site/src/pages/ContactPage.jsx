import { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, ChevronDown, Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { CONTACT, SOCIALS } from '../config';
import { useScrollReveal } from '../hooks/useScrollReveal';

const socialIcons = { LinkedIn: Linkedin, 'X (Twitter)': Twitter, Instagram: Instagram, Facebook: Facebook, YouTube: Youtube };

const CHANNELS = [
    { icon: Mail, label: 'Email Us', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: 'Call Us', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/[^+\d]/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat on WhatsApp', href: CONTACT.whatsapp },
    { icon: MapPin, label: 'Location', value: CONTACT.location, href: null },
    { icon: Clock, label: 'Working Hours', value: CONTACT.hours, href: null },
];

const FAQS = [
    {
        q: 'What does EVEX Digital Company do?',
        a: 'We build a connected ecosystem of digital products — including the EVEX Business Platform (live), the EVEX Super App, and the EVEX Learning Hub — designed to connect people, educate communities, and empower businesses.',
    },
    {
        q: 'Is the EVEX Business Platform live?',
        a: 'Yes! The EVEX Business Platform is live today. You can browse products, create an account, and even sell as a business owner. Visit the Products section to explore it.',
    },
    {
        q: 'Can I collaborate or partner with EVEX?',
        a: 'Absolutely. We love working with developers, designers, educators, entrepreneurs, and investors. Send us an email or use the contact form and we will get back to you.',
    },
    {
        q: 'How do I join the EVEX team?',
        a: 'Head over to our Careers page, pick a role you are interested in, and email us your CV — we review every application and will reach out if there is a match.',
    },
    {
        q: 'How long does it take to get a response?',
        a: 'We usually reply within 24–48 hours on business days. For urgent matters, WhatsApp is the fastest way to reach us.',
    },
];

const ContactPage = () => {
    const revealRef = useScrollReveal();
    const [form, setForm] = useState({ name: '', email: '', topic: 'General Inquiry', message: '' });
    const [openFaq, setOpenFaq] = useState(0);

    const handleMailto = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`${form.topic} — ${form.name}`);
        const body = encodeURIComponent(`Hi EVEX Team,\n\n${form.message}\n\n— ${form.name}\n${form.email}`);
        window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div ref={revealRef}>
            <section id="page-hero" style={{ paddingTop: 180 }}>
                <div className="section-inner">
                    <span className="eyebrow reveal in">Contact</span>
                    <h1 className="section-title reveal in" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', maxWidth: 720 }}>
                        Let's start a <span className="grad-text">conversation.</span>
                    </h1>
                    <p className="section-text reveal in" style={{ maxWidth: 640 }}>
                        Questions, ideas, partnerships, or just want to say hello? Reach out — we'd love to hear from you.
                    </p>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner grid-5">
                    {CHANNELS.map((c) => {
                        const content = (
                            <>
                                <div className="eco-icon"><c.icon size={22} /></div>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 8px' }}>{c.label}</h3>
                                <p className="section-text" style={{ fontSize: '.88rem', margin: 0 }}>{c.value}</p>
                            </>
                        );
                        return c.href ? (
                            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact-card reveal" style={{ textDecoration: 'none' }}>
                                {content}
                            </a>
                        ) : (
                            <div key={c.label} className="contact-card reveal">{content}</div>
                        );
                    })}
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner grid-2-even">
                    <div className="feature-card reveal">
                        <div className="feature-icon"><Send size={22} /></div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 12px' }}>Send us a message</h3>
                        <p className="section-text" style={{ fontSize: '.92rem', margin: '0 0 22px' }}>
                            Fill this in and it will open your email app with everything pre-filled.
                        </p>
                        <form onSubmit={handleMailto}>
                            <div className="form-group">
                                <label htmlFor="c-name">Your name</label>
                                <input id="c-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-email">Your email</label>
                                <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-topic">Topic</label>
                                <select id="c-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                                    <option>General Inquiry</option>
                                    <option>Partnership</option>
                                    <option>Business Platform Support</option>
                                    <option>Learning Hub Interest</option>
                                    <option>Media / Press</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-message">Message</label>
                                <textarea id="c-message" rows="5" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
                            </div>
                            <button type="submit" className="btn-primary btn-block">Send via Email <Send size={15} /></button>
                        </form>
                    </div>

                    <div className="feature-card reveal">
                        <div className="feature-icon"><ChevronDown size={22} /></div>
                        <h3 style={{ fontSize: '1.3rem', margin: '0 0 4px' }}>Frequently asked questions</h3>
                        <div className="faq-list">
                            {FAQS.map((f, i) => (
                                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                                        {f.q}
                                        <ChevronDown size={17} />
                                    </button>
                                    {openFaq === i && <p className="faq-a">{f.a}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ paddingTop: 0 }}>
                <div className="section-inner" style={{ textAlign: 'center' }}>
                    <div className="coming-soon reveal" style={{ maxWidth: 720, margin: '0 auto' }}>
                        <span className="eyebrow" style={{ justifyContent: 'center' }}>Follow the journey</span>
                        <h2 className="section-title">Stay <span className="grad-text">connected.</span></h2>
                        <p className="section-text" style={{ maxWidth: 500, margin: '0 auto 30px' }}>
                            Follow EVEX on social media for product updates, behind-the-scenes, and community news.
                        </p>
                        <div className="social-row">
                            {SOCIALS.map((s) => {
                                const Icon = socialIcons[s.label] || Mail;
                                return (
                                    <a key={s.label} href={s.url} className="social-btn" aria-label={s.label} title={s.label}>
                                        <Icon size={20} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;