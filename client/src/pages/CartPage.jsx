import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cart, updateQuantity, removeItem, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="cart-page">
                <h2>Cart</h2>
                <p>Please <a href="/login">login</a> to view your cart.</p>
            </div>
        );
    }

    if (loading) return <p>Loading...</p>;

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page">
                <h2>Cart</h2>
                <p>Your cart is empty.</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Cart</h2>
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.product?._id || item.product} className="cart-item">
                        <img src={item.product?.imageUrl} alt={item.product?.name} />
                        <div className="cart-item-info">
                            <h3>{item.product?.name}</h3>
                            <p>${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="cart-item-actions">
                            <select
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product?._id || item.product, Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <button className="btn btn-danger" onClick={() => removeItem(item.product?._id || item.product)}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>
                <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;
