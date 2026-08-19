import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const { addToCart } = useCart();
    const { user } = useAuth();

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
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
            alert('Added to cart!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        try {
            await API.post(`/products/${id}/reviews`, { rating, comment });
            setReviewSuccess('Review added!');
            setComment('');
            fetchProduct();
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to add review');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div className="product-detail">
            <div className="product-detail-main">
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-rating">{'⭐'.repeat(Math.round(product.rating))} ({product.numReviews} reviews)</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
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
                <h3>Reviews</h3>
                {product.reviews.length === 0 && <p>No reviews yet.</p>}
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
                        {reviewError && <div className="alert alert-error">{reviewError}</div>}
                        {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
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
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
