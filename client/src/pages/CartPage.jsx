import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/format';

const CartPage = () => {
    const { cart, updateQuantity, removeItem, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    if (loading) return <LoadingSpinner text="Loading cart..." />;

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page">
                <h2>Cart</h2>
                <EmptyState
                    icon="🛒"
                    title="Your cart is empty"
                    message="Add some products to get started!"
                    actionLabel="Continue Shopping"
                    onAction={() => navigate('/products')}
                />
            </div>
        );
    }

    const handleUpdateQuantity = async (productId, qty) => {
        try {
            await updateQuantity(productId, qty);
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeItem(productId);
            toast.success('Item removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    return (
        <div className="cart-page">
            <h2>Cart</h2>
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.product?._id || item.product} className="cart-item">
                        <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23eee" width="80" height="80"/></svg>';
                            }}
                        />
                        <div className="cart-item-info">
                            <h3>{item.product?.name}</h3>
                            <p>{formatPrice(item.price)} x {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <div className="cart-item-actions">
                            <select
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.product?._id || item.product, Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.product?._id || item.product)}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: {formatPrice(cart.totalPrice)}</h3>
                <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;
