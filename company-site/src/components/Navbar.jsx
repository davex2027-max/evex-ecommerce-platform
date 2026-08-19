import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { LINKS } from '../config';

const NAV_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Products', href: '#ecosystem' },
    { label: 'Learning Hub', href: '#technology' },
    { label: 'Business', href: '#ecosystem' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#final-cta' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
                <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
                    <img src="/evex-logo.png" alt="EVEX logo" className="logo-mark" />
                    <span className="display" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', letterSpacing: '.01em' }}>
                        EVEX
                    </span>
                </a>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href}>{l.label}</a>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <a href="#team" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Join the Team <ArrowRight size={16} />
                    </a>
                    <button id="menu-open" aria-label="Open menu" className="nav-icon-btn" onClick={() => setMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <div id="mobile-menu" className={menuOpen ? 'open' : ''}>
                <button
                    id="menu-close"
                    aria-label="Close menu"
                    className="nav-icon-btn"
                    style={{ position: 'absolute', top: 22, right: 24 }}
                    onClick={() => setMenuOpen(false)}
                >
                    <X size={28} />
                </button>
                {NAV_LINKS.map((l) => (
                    <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
                ))}
                <a href="#team" className="btn-primary" style={{ marginTop: 10, textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                    Join the Team
                </a>
            </div>
        </>
    );
};

export default Navbar;