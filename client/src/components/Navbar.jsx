import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/evex-logo.png" alt="EVEX" className="navbar-logo" />
                <span>EVEX</span>
            </Link>
            <div className="navbar-links">
                <Link to="/products">Products</Link>
                <Link to="/ads">Ads</Link>
                <Link to="/cart">Cart ({itemCount})</Link>
                {user ? (
                    <>
                        {(user.role === 'business_owner' || user.role === 'advertiser') && (
                            <Link to="/my-ads">My Ads</Link>
                        )}
                        {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                        <span className="navbar-user">{user.name}</span>
                        <button onClick={logout} className="btn btn-sm">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
