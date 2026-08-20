import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
    { label: 'Home', type: 'route', to: '/' },
    { label: 'About', type: 'route', to: '/about' },
    { label: 'Products', type: 'section', to: 'ecosystem' },
    { label: 'Team', type: 'section', to: 'team' },
    { label: 'Contact', type: 'route', to: '/contact' },
];

const SectionLink = ({ id, children, onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e) => {
        e.preventDefault();
        onNavigate?.();
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 80);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a href={`/#${id}`} onClick={handleClick}>{children}</a>
    );
};

const NavLink = ({ link, onNavigate }) => {
    if (link.type === 'route') {
        return <Link to={link.to} onClick={onNavigate}>{link.label}</Link>;
    }
    return <SectionLink id={link.to} onNavigate={onNavigate}>{link.label}</SectionLink>;
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
                    <img src="/evex-logo.png" alt="EVEX logo" className="logo-mark" />
                    <span className="display" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', letterSpacing: '.01em' }}>
                        EVEX
                    </span>
                </Link>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                    {NAV_LINKS.map((l) => (
                        <NavLink key={l.label} link={l} onNavigate={closeMenu} />
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Link to="/careers" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Join the Team <ArrowRight size={16} />
                    </Link>
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
                    onClick={closeMenu}
                >
                    <X size={28} />
                </button>
                {NAV_LINKS.map((l) => (
                    <NavLink key={l.label} link={l} onNavigate={closeMenu} />
                ))}
                <Link to="/careers" className="btn-primary" style={{ marginTop: 10, textDecoration: 'none' }} onClick={closeMenu}>
                    Join the Team
                </Link>
            </div>
        </>
    );
};

export default Navbar;