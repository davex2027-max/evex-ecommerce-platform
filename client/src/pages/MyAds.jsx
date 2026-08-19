import { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyAds = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchAds = async () => {
        try {
            setError('');
            const { data } = await API.get('/ads/my-ads');
            setAds(data);
        } catch (err) {
            setError('Failed to load your ads.');
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
        setSubmitting(true);
        try {
            if (editingId) {
                await API.put(`/ads/${editingId}`, form);
                toast.success('Ad updated!');
            } else {
                await API.post('/ads', form);
                toast.success('Ad created!');
            }
            setForm({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' });
            setEditingId(null);
            setShowForm(false);
            fetchAds();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save ad');
        } finally {
            setSubmitting(false);
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
        if (!window.confirm('Delete this ad?')) return;
        try {
            await API.delete(`/ads/${id}`);
            toast.success('Ad deleted');
            fetchAds();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete ad');
        }
    };

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23eee" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">No Image</text></svg>';
    };

    if (loading) return <LoadingSpinner text="Loading your ads..." />;

    return (
        <div className="my-ads-page">
            <div className="page-header">
                <h2>My Ads</h2>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '' }); }}>
                    {showForm ? 'Cancel' : '+ New Ad'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

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
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Saving...' : (editingId ? 'Update Ad' : 'Create Ad')}
                    </button>
                </form>
            )}

            {ads.length === 0 && !showForm ? (
                <EmptyState
                    icon="📢"
                    title="No ads yet"
                    message="Create your first ad to reach customers."
                    actionLabel="+ New Ad"
                    onAction={() => setShowForm(true)}
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
