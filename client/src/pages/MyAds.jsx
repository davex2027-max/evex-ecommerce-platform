import { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['Electronics', 'Fashion', 'Food & Drinks', 'Services', 'Real Estate', 'Automotive', 'Health & Beauty', 'Education', 'Events', 'Other'];

const PLANS = [
    { id: 'free', name: 'Free', price: 'Free', features: ['Basic listing', '1 image', '30 days visible'] },
    { id: 'basic', name: 'Basic', price: '\u20A62,500/mo', features: ['Enhanced listing', '3 images', '60 days visible', 'Contact link'] },
    { id: 'premium', name: 'Premium', price: '\u20A65,000/mo', features: ['Priority listing', '5 images', '90 days visible', 'Highlighted badge', 'Homepage feature'] },
    { id: 'featured', name: 'Featured', price: '\u20A610,000/mo', features: ['Top placement', 'Unlimited images', '120 days visible', 'Gold badge', 'Homepage spotlight', 'Social media boost'] },
];

const MyAds = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '', website: '', email: '', price: '', location: '', plan: 'free' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    useEffect(() => { fetchAds(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ ...form, imageUrl: data.imageUrl });
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.imageUrl) {
            toast.error('Please upload an image');
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                await API.put(`/ads/${editingId}`, form);
                toast.success('Ad updated!');
            } else {
                await API.post('/ads', form);
                toast.success('Ad created!');
            }
            resetForm();
            fetchAds();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save ad');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ businessName: '', title: '', description: '', category: '', contactPhone: '', imageUrl: '', website: '', email: '', price: '', location: '', plan: 'free' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (ad) => {
        setForm({
            businessName: ad.businessName, title: ad.title, description: ad.description,
            category: ad.category, contactPhone: ad.contactPhone, imageUrl: ad.imageUrl,
            website: ad.website || '', email: ad.email || '', price: ad.price || '',
            location: ad.location || '', plan: ad.plan || 'free',
        });
        setEditingId(ad._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (loading) return <LoadingSpinner text="Loading your ads..." />;

    return (
        <div className="my-ads-page">
            <div className="page-header">
                <div>
                    <h2 style={{ fontWeight: 800 }}>My Ads</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Create and manage your advertisements</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); if (!showForm) setEditingId(null); if (showForm) resetForm(); }}>
                    {showForm ? 'Cancel' : '+ Create Ad'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {showForm && (
                <div style={{ animation: 'fadeUp 0.4s ease' }}>
                    <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{editingId ? 'Edit Ad' : 'Create New Ad'}</h3>

                    {!editingId && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                            {PLANS.map((plan) => (
                                <div key={plan.id} onClick={() => setForm({ ...form, plan: plan.id })}
                                    style={{
                                        background: '#fff', padding: 20, borderRadius: 16, cursor: 'pointer',
                                        border: form.plan === plan.id ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                                        boxShadow: form.plan === plan.id ? '0 0 0 4px rgba(108,92,231,0.1)' : 'none',
                                        transition: 'all 0.3s ease', position: 'relative',
                                    }}>
                                    {plan.id === 'featured' && <span style={{ position: 'absolute', top: -10, right: 12, background: 'var(--gradient)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>POPULAR</span>}
                                    {plan.id === 'premium' && <span style={{ position: 'absolute', top: -10, right: 12, background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>BEST VALUE</span>}
                                    <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{plan.name}</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 10 }}>{plan.price}</p>
                                    {plan.features.map((f, i) => (
                                        <p key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>{"\u2713"} {f}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="ad-form" style={{ maxWidth: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>Business Name</label>
                                <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Your business name" required />
                            </div>
                            <div className="form-group">
                                <label>Ad Title</label>
                                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Samsung Galaxy S24 - Brand New" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what you're advertising..." required rows={4} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={form.category} onChange={handleChange} required>
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price (optional)</label>
                                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. \u20A650,000" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+234..." required />
                            </div>
                            <div className="form-group">
                                <label>Email (optional)</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="business@email.com" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>Website (optional)</label>
                                <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label>Location (optional)</label>
                                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Lagos, Nigeria" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ad Image</label>
                            {form.imageUrl ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, background: 'var(--bg)', borderRadius: 12, border: '2px solid var(--border-light)' }}>
                                    <img src={form.imageUrl} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>Image uploaded</p>
                                        <button type="button" className="btn btn-sm btn-outline" style={{ marginTop: 6 }} onClick={() => setForm({ ...form, imageUrl: '' })}>Remove</button>
                                    </div>
                                </div>
                            ) : (
                                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, border: '2px dashed var(--border-light)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg)', transition: 'all 0.3s ease' }}>
                                    <span style={{ fontSize: '2rem', marginBottom: 8 }}>{uploading ? '\u23F3' : '\u{1F4F7}'}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPEG, PNG, WebP up to 5MB</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                                </label>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting || uploading} style={{ marginTop: 8 }}>
                            {submitting ? 'Saving...' : editingId ? 'Update Ad' : 'Publish Ad'}
                        </button>
                    </form>
                </div>
            )}

            {!showForm && ads.length === 0 ? (
                <EmptyState
                    icon={'\u{1F4E2}'}
                    title="No ads yet"
                    message="Create your first ad to reach thousands of customers across Nigeria."
                    actionLabel="+ Create Ad"
                    onAction={() => setShowForm(true)}
                />
            ) : !showForm && (
                <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.92rem' }}>{ads.length} ad{ads.length !== 1 ? 's' : ''} total</p>
                    <div className="ads-grid">
                        {ads.map((ad) => (
                            <div key={ad._id} className="ad-card" style={{ position: 'relative' }}>
                                {ad.featured && <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gradient)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, zIndex: 1 }}>{ad.plan === 'featured' ? '\u2B50 Featured' : '\u{1F525} Premium'}</span>}
                                <img src={ad.imageUrl} alt={ad.title} />
                                <div className="ad-info">
                                    <h3>{ad.title}</h3>
                                    <p className="ad-business">{ad.businessName}</p>
                                    <p className="ad-category">{ad.category}</p>
                                    {ad.price && <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem', marginTop: 4 }}>{ad.price}</p>}
                                    {ad.location && <p className="ad-contact" style={{ marginTop: 4 }}>{'\u{1F4CD}'} {ad.location}</p>}
                                    <div className="ad-actions" style={{ marginTop: 12 }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(ad)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ad._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAds;
