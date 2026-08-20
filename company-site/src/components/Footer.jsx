import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT, LINKS } from '../config';

const Footer = () => {
    const [email, setEmail] = useState('');

    const subscribe = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent('Newsletter Subscription');
        const body = encodeURIComponent(`Please subscribe ${email} to the EVEX newsletter.`);
        window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
        setEmail('');
    };

    return (
        <footer>
            <div className="newsletter-row">
                <div>
                    <h3 className="display" style={{ margin: 0 }}>Get EVEX <span className="grad-text">updates.</span></h3>
                    <p className="section-text" style={{ fontSize: '.9rem', margin: '6px 0 0' }}>Product launches, community news, and behind-the-scenes. No spam.</p>
                </div>
                <form onSubmit={subscribe} className="newsletter-form">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        aria-label="Email address"
                    />
                    <button type="submit" className="btn-primary">Subscribe</button>
                </form>
            </div>

            <div className="footer-grid">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
                        <img src="/evex-logo.png" alt="EVEX logo" className="logo-mark" />
                        <span className="display" style={{ fontWeight: 700, fontSize: '1.1rem' }}>EVEX Digital Company</span>
                    </div>
                    <p className="section-text" style={{ fontSize: '.9rem', maxWidth: 280 }}>
                        Engineering intelligent digital experiences that connect, educate, and elevate.
                    </p>
                </div>
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Ecosystem</h4>
                    <ul>
                        <li><Link to="/">EVEX Super App</Link></li>
                        <li><Link to="/">Learning Hub</Link></li>
                        <li><a href={LINKS.businessPlatform} target="_blank" rel="noreferrer">Business Platform</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Connect</h4>
                    <ul>
                        <li><a href={`mailto:${CONTACT.email}`}>Email</a></li>
                        <li><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
                        <li><Link to="/contact">Social Media</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2026 EVEX Digital Company. All Rights Reserved.</span>
                <span>Let's build the future, digitally.</span>
            </div>
        </footer>
    );
};

export default Footer;