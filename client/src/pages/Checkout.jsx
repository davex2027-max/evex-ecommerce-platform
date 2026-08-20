import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/format';

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
    const toast = useToast();

    const shippingPrice = cart.totalPrice > 500000 ? 0 : 50000;
    const taxPrice = cart.totalPrice * 0.1;
    const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

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

            if (paymentMethod === 'paystack') {
                const { data: payment } = await API.post(`/payment/${order._id}/pay`);
                window.location.href = payment.authorization_url;
                return;
            }

            toast.success('Order placed successfully!');
            navigate('/my-orders');
        } catch (err) {
            const msg = err.response?.data?.message || 'Order failed';
            setError(msg);
            toast.error(msg);
            setLoading(false);
        }
    };

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="checkout-page">
                <h2>Checkout</h2>
                <EmptyState
                    icon="🛒"
                    title="Your cart is empty"
                    message="Add some products before checking out."
                    actionLabel="Shop Now"
                    onAction={() => navigate('/products')}
                />
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
                            <option value="paystack">Card / Transfer / USSD (Paystack)</option>
                        </select>
                    </div>

                    <div className="checkout-summary">
                        <h3>Order Summary</h3>
                        <p>Subtotal: {formatPrice(cart.totalPrice)}</p>
                        <p>Shipping: {shippingPrice === 0 ? `${formatPrice(0)} (Free)` : formatPrice(shippingPrice)}</p>
                        <p>Tax (10%): {formatPrice(taxPrice)}</p>
                        <p><strong>Total: {formatPrice(totalPrice)}</strong></p>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '16px' }}>
                        {loading ? 'Redirecting to Paystack...' : paymentMethod === 'paystack' ? 'Pay with Paystack' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;