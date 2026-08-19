import { ArrowRight } from 'lucide-react';
import { CONTACT } from '../config';

const Cta = () => (
    <section>
        <div id="final-cta" className="reveal">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Let's Talk</span>
            <h2 className="section-title">
                The future is being built <span className="grad-text">right now.</span>
            </h2>
            <p className="section-text" style={{ maxWidth: 560, margin: '0 auto 34px' }}>
                Have an idea? Want to collaborate? Want to learn? Want to build the next generation of digital
                products with us?
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <a href="#ecosystem" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Explore EVEX <ArrowRight size={16} />
                </a>
                <a href={`mailto:${CONTACT.email}`} className="btn-ghost">Contact Us</a>
            </div>
        </div>
    </section>
);

export default Cta;