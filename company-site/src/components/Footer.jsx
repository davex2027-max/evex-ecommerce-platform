import { CONTACT } from '../config';

const Footer = () => (
    <footer>
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
                    <li><a href="#about">About</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#team">Careers</a></li>
                    <li><a href="#final-cta">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4>Ecosystem</h4>
                <ul>
                    <li><a href="#coming-soon">EVEX Super App</a></li>
                    <li><a href="#coming-soon">Learning Hub</a></li>
                    <li><a href="#ecosystem">Business Platform</a></li>
                </ul>
            </div>
            <div>
                <h4>Connect</h4>
                <ul>
                    <li><a href={`mailto:${CONTACT.email}`}>Email</a></li>
                    <li><a href="#final-cta">WhatsApp</a></li>
                    <li><a href="#final-cta">Social Media</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            <span>© 2026 EVEX Digital Company. All Rights Reserved.</span>
            <span>Let's build the future, digitally.</span>
        </div>
    </footer>
);

export default Footer;