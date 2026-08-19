import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const params = { page, pageSize: 12 };
            if (keyword) params.keyword = keyword;
            if (category) params.category = category;
            const { data } = await API.get('/products', { params });
            setProducts(data.products);
            setPages(data.pages);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, category]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23eee" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">No Image</text></svg>';
    };

    return (
        <div className="product-list-page">
            <h2>Products</h2>

            <div className="filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <LoadingSpinner text="Loading products..." />
            ) : products.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No products found"
                    message="Try adjusting your search or filter."
                />
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <Link to={`/products/${product._id}`} key={product._id} className="product-card">
                            <img src={product.imageUrl} alt={product.name} onError={handleImageError} />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-brand">{product.brand}</p>
                                <p className="product-rating">{'⭐'.repeat(Math.round(product.rating))} ({product.numReviews})</p>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {pages > 1 && (
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span>Page {page} of {pages}</span>
                    <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
