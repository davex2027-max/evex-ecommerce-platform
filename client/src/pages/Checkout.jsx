import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data: order } = await API.post('/orders', {
                shippingAddress: { address, city, postalCode, country },
                paymentMethod,
            });
            await fetchCart();
            if (paymentMethod === 'stripe') {
                const { data } = await API.post(`/payment/${order._id}/pay`);
                alert(`Order placed! Stripe client secret received. (Payment integration is live - use test card 4242 4242 4242 4242)`);
            } else {
                alert('Order placed successfully!');
            }
            navigate('/my-orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Order failed');
        } finally {
            setLoading(false);
        }
    };

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="checkout-page">
                <h2>Checkout</h2>
                <p>Your cart is empty. <a href="/products">Shop now</a></p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <div className="checkout-content">
                <form onSubmit={handleSubmit} className="checkout-form">
                    <h3>Shipping Address</h3>
                    {error && <div className="alert alert-error">{error}</div>}
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Postal Code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>

                    <h3>Payment Method</h3>
                    <div className="form-group">
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="cod">Cash on Delivery</option>
                            <option value="stripe">Credit/Debit Card (Stripe)</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>

                    <div className="checkout-summary">
                        <h3>Order Summary</h3>
                        <p>Subtotal: ${cart.totalPrice.toFixed(2)}</p>
                        <p>Shipping: ${cart.totalPrice > 500 ? '0.00 (Free)' : '50.00'}</p>
                        <p>Tax (10%): ${(cart.totalPrice * 0.1).toFixed(2)}</p>
                        <p><strong>Total: ${(cart.totalPrice + (cart.totalPrice > 500 ? 0 : 50) + cart.totalPrice * 0.1).toFixed(2)}</strong></p>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
