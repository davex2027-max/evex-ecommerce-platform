import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/format';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const toast = useToast();

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
            setError('Product not found.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(id, quantity);
            toast.success('Added to cart!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        setReviewSubmitting(true);
        try {
            await API.post(`/products/${id}/reviews`, { rating, comment });
            toast.success('Review added!');
            setComment('');
            setRating(5);
            fetchProduct();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23eee" width="400" height="400"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16">No Image</text></svg>';
    };

    if (loading) return <LoadingSpinner text="Loading product..." />;
    if (error || !product) return <div className="alert alert-error">{error || 'Product not found.'}</div>;

    return (
        <div className="product-detail">
            <div className="product-detail-main">
                <img src={product.imageUrl} alt={product.name} onError={handleImageError} />
                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-rating">{'⭐'.repeat(Math.round(product.rating))} ({product.numReviews} reviews)</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <p className="product-category">Category: {product.category}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">
                        {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                    </p>
                    {product.countInStock > 0 && (
                        <div className="add-to-cart">
                            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                                {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="reviews-section">
                <h3>Reviews ({product.reviews.length})</h3>
                {product.reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
                {product.reviews.map((review) => (
                    <div key={review._id} className="review">
                        <strong>{review.name}</strong>
                        <span>{'⭐'.repeat(review.rating)}</span>
                        <p>{review.comment}</p>
                    </div>
                ))}

                {user && (
                    <div className="review-form">
                        <h4>Write a Review</h4>
                        <form onSubmit={handleReview}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                    <option value={1}>1 - Poor</option>
                                    <option value={2}>2 - Fair</option>
                                    <option value={3}>3 - Good</option>
                                    <option value={4}>4 - Very Good</option>
                                    <option value={5}>5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
