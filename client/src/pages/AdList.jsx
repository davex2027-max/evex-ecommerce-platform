import { useState, useEffect } from 'react';
import API from '../api';

const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const { data } = await API.get('/ads');
                setAds(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="ads-page">
            <h2>Community Ads</h2>
            {ads.length === 0 ? <p>No ads yet.</p> : (
                <div className="ads-grid">
                    {ads.map((ad) => (
                        <div key={ad._id} className="ad-card">
                            <img src={ad.imageUrl} alt={ad.title} />
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
