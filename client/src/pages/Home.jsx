import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api';
import { formatPrice } from '../utils/format';

const Home = () => {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await API.get('/products', { params: { pageSize: 4 } });
                setFeatured(data.products || []);
            } catch {}
        };
        load();
    }, []);

    return (
        <div className="home">
            <div className="hero">
                <div className="hero-content">
                    <img src="/evex-logo.png" alt="EVEX" className="hero-logo" />
                    <h1>Shop Smarter, Live Better</h1>
                    <p>Discover premium products from trusted sellers. Fast delivery, secure payments, and unbeatable value across Nigeria.</p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary">Shop Now</Link>
                        <Link to="/ads" className="btn btn-secondary">Browse Ads</Link>
                    </div>
                </div>
            </div>

            {featured.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                    <h2 className="section-title">Featured Products</h2>
                    <p className="section-subtitle">Handpicked deals just for you</p>
                    <div className="product-grid">
                        {featured.map((p) => (
                            <Link to={`/products/${p._id}`} key={p._id} className="product-card">
                                <img src={p.imageUrl} alt={p.name} />
                                <div className="product-info">
                                    <h3>{p.name}</h3>
                                    <p className="product-brand">{p.brand}</p>
                                    <p className="product-price">{formatPrice(p.price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 28 }}>
                        <Link to="/products" className="btn btn-outline">View All Products</Link>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
                {[
                    { icon: '\u{1F6E5}\uFE0F', title: 'Fast Delivery', desc: 'Quick and reliable shipping nationwide' },
                    { icon: '\u{1F512}', title: 'Secure Payments', desc: 'Pay safely with Paystack or COD' },
                    { icon: '\u{2B50}', title: 'Quality Guaranteed', desc: 'Top-rated products from trusted sellers' },
                    { icon: '\u{1F4AC}', title: '24/7 Support', desc: 'We are always here to help you' },
                ].map((item) => (
                    <div key={item.title} style={{ background: '#fff', padding: 28, borderRadius: 16, textAlign: 'center', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
                        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>{item.icon}</span>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
