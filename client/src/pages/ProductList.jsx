import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page, pageSize: 12 };
            if (keyword) params.keyword = keyword;
            if (category) params.category = category;
            const { data } = await API.get('/products', { params });
            setProducts(data.products);
            setPages(data.pages);
        } catch (err) {
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

            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <Link to={`/products/${product._id}`} key={product._id} className="product-card">
                            <img src={product.imageUrl} alt={product.name} />
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
