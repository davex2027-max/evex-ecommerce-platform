import { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['Electronics', 'Fashion', 'Food & Drinks', 'Services', 'Real Estate', 'Automotive', 'Health & Beauty', 'Education', 'Events', 'Other'];

const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [selectedAd, setSelectedAd] = useState(null);

    const fetchAds = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (keyword) params.keyword = keyword;
            if (category) params.category = category;
            const { data } = await API.get('/ads', { params });
            setAds(data);
        } catch (err) {
            setError('Failed to load ads.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAds(); }, [category]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAds();
    };

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23eee" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">No Image</text></svg>';
    };

    if (loading) return <LoadingSpinner text="Loading ads..." />;

    return (
        <div className="ads-page">
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontWeight: 800, marginBottom: 4 }}>{'\u{1F4E2}'} Community Ads</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Discover local businesses and services from our community</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input type="text" placeholder="Search ads..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {ads.length === 0 ? (
                <EmptyState
                    icon={'\u{1F4E2}'}
                    title="No ads found"
                    message="Be the first to post an ad in this category!"
                />
            ) : (
                <div className="ads-grid">
                    {ads.map((ad) => (
                        <div key={ad._id} className="ad-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedAd(ad)}>
                            {ad.featured && <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gradient)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, zIndex: 1 }}>{ad.plan === 'featured' ? '\u2B50 Featured' : '\u{1F525} Premium'}</span>}
                            <img src={ad.imageUrl} alt={ad.title} onError={handleImageError} />
                            <div className="ad-info">
                                <h3>{ad.title}</h3>
                                <p className="ad-business">{ad.businessName}</p>
                                <p className="ad-category">{ad.category}</p>
                                {ad.price && <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem', marginTop: 6 }}>{ad.price}</p>}
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.5 }}>{ad.description?.substring(0, 100)}{ad.description?.length > 100 ? '...' : ''}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    {ad.location && <p className="ad-contact">{'\u{1F4CD}'} {ad.location}</p>}
                                    <button className="btn btn-sm btn-primary">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAd && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedAd(null)}>
                    <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', maxWidth: 560, width: '100%', maxHeight: '85vh', overflow: 'auto', animation: 'fadeUp 0.3s ease' }} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedAd.imageUrl} alt={selectedAd.title} style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
                        <div style={{ padding: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>{selectedAd.title}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{selectedAd.businessName}</p>
                                </div>
                                <button onClick={() => setSelectedAd(null)} className="btn btn-sm btn-outline">Close</button>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                                <span className="ad-category">{selectedAd.category}</span>
                                {selectedAd.price && <span style={{ background: 'rgba(108,92,231,0.08)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{selectedAd.price}</span>}
                                {selectedAd.featured && <span style={{ background: 'var(--gradient)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{selectedAd.plan === 'featured' ? '\u2B50 Featured' : '\u{1F525} Premium'}</span>}
                            </div>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20 }}>{selectedAd.description}</p>
                            <div style={{ borderTop: '2px solid var(--border-light)', paddingTop: 16 }}>
                                <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Contact Information</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <p style={{ fontSize: '0.92rem' }}>{'\u{1F4DE}'} <strong>{selectedAd.contactPhone}</strong></p>
                                    {selectedAd.email && <p style={{ fontSize: '0.92rem' }}>{'\u{2709}\uFE0F'} {selectedAd.email}</p>}
                                    {selectedAd.website && <p style={{ fontSize: '0.92rem' }}>{'\u{1F310}'} <a href={selectedAd.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{selectedAd.website}</a></p>}
                                    {selectedAd.location && <p style={{ fontSize: '0.92rem' }}>{'\u{1F4CD}'} {selectedAd.location}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdList;
