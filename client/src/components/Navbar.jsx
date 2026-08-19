import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
                <img src="/evex-logo.png" alt="EVEX" className="navbar-logo" />
                <span>EVEX</span>
            </Link>

            <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
            </button>

            <div className={`navbar-links ${menuOpen ? 'navbar-open' : ''}`}>
                <Link to="/products" className={isActive('/products')} onClick={closeMenu}>Products</Link>
                <Link to="/ads" className={isActive('/ads')} onClick={closeMenu}>Ads</Link>
                <Link to="/cart" className={isActive('/cart')} onClick={closeMenu}>Cart{itemCount > 0 ? ` (${itemCount})` : ''}</Link>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Link to="/admin" className={isActive('/admin')} onClick={closeMenu}>Admin</Link>
                        )}
                        {(user.role === 'business_owner' || user.role === 'advertiser') && (
                            <Link to="/my-ads" className={isActive('/my-ads')} onClick={closeMenu}>My Ads</Link>
                        )}
                        <Link to="/my-orders" className={isActive('/my-orders')} onClick={closeMenu}>My Orders</Link>
                        <span className="navbar-user">{user.name}</span>
                        <button onClick={handleLogout} className="btn btn-sm">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={isActive('/login')} onClick={closeMenu}>Login</Link>
                        <Link to="/register" className={isActive('/register')} onClick={closeMenu}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
