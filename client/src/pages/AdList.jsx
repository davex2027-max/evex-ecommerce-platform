import { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const { data } = await API.get('/ads');
                setAds(data);
            } catch (err) {
                setError('Failed to load ads.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23eee" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">No Image</text></svg>';
    };

    if (loading) return <LoadingSpinner text="Loading ads..." />;

    return (
        <div className="ads-page">
            <h2>Community Ads</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {ads.length === 0 ? (
                <EmptyState
                    icon="📢"
                    title="No ads yet"
                    message="Community ads will appear here once posted."
                />
            ) : (
                <div className="ads-grid">
                    {ads.map((ad) => (
                        <div key={ad._id} className="ad-card">
                            <img src={ad.imageUrl} alt={ad.title} onError={handleImageError} />
                            <div className="ad-info">
                                <h3>{ad.title}</h3>
                                <p className="ad-business">{ad.businessName}</p>
                                <p className="ad-category">{ad.category}</p>
                                <p>{ad.description}</p>
                                <p className="ad-contact">{ad.contactPhone}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdList;
