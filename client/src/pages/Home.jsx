import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <div className="hero">
                <img src="/evex-logo.png" alt="EVEX E Commerce Platform" className="hero-logo" />
                <h1>Welcome to EVEX E Commerce Platform</h1>
                <p>Shop products, discover local businesses, and grow your brand.</p>
                <div className="hero-actions">
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                    <Link to="/ads" className="btn btn-secondary">Browse Ads</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
