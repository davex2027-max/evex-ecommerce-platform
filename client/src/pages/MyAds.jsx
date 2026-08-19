import { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const MyAds = () => {
    const { user } = useAuth();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchAds = async () => {
        try {
            const { data } = await API.get('/ads/my-ads');
            setAds(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/ads/${editingId}`, form);
            } else {
                await API.post('/ads', form);
            }
            setForm({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' });
            setEditingId(null);
            setShowForm(false);
            fetchAds();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    const handleEdit = (ad) => {
        setForm({
            businessName: ad.businessName,
            title: ad.title,
            description: ad.description,
            category: ad.category,
            contactPhone: ad.contactPhone,
            imageUrl: ad.imageUrl,
        });
        setEditingId(ad._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this ad?')) return;
        try {
            await API.delete(`/ads/${id}`);
            fetchAds();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="my-ads-page">
            <div className="page-header">
                <h2>My Ads</h2>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' }); }}>
                    {showForm ? 'Cancel' : '+ New Ad'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="ad-form">
                    <div className="form-group">
                        <label>Business Name</label>
                        <input name="businessName" value={form.businessName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input name="category" value={form.category} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contact Phone</label>
                        <input name="contactPhone" value={form.contactPhone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Ad' : 'Create Ad'}</button>
                </form>
            )}

            {ads.length === 0 && !showForm ? <p>You haven't posted any ads yet.</p> : (
                <div className="ads-grid">
                    {ads.map((ad) => (
                        <div key={ad._id} className="ad-card">
                            <img src={ad.imageUrl} alt={ad.title} />
                            <div className="ad-info">
                                <h3>{ad.title}</h3>
                                <p className="ad-business">{ad.businessName}</p>
                                <p className="ad-category">{ad.category}</p>
                                <div className="ad-actions">
                                    <button className="btn btn-sm" onClick={() => handleEdit(ad)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ad._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAds;
