import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <h4>EVEX E-Commerce</h4>
                    <p>Your trusted marketplace for premium products. Shop with confidence.</p>
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <Link to="/products">Products</Link>
                    <Link to="/ads">Ads</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/my-orders">My Orders</Link>
                </div>
                <div>
                    <h4>Account</h4>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/my-orders">Order History</Link>
                </div>
                <div>
                    <h4>Contact</h4>
                    <p>hello@evexdigital.com</p>
                    <p>+234 902 766 4131</p>
                    <p>Nigeria</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EVEX Digital Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
