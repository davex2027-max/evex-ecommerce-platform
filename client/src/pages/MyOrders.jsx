import { useState, useEffect } from 'react';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/format';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/my-orders');
                setOrders(data);
            } catch (err) {
                setError('Failed to load orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <LoadingSpinner text="Loading orders..." />;

    return (
        <div className="orders-page">
            <h2>My Orders</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {orders.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No orders yet"
                    message="Your order history will appear here."
                />
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <h4>Order #{order._id.slice(-6)}</h4>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Total: {formatPrice(order.totalPrice)}</p>
                            <p>Payment: {order.paymentMethod.toUpperCase()}</p>
                            <p>
                                Status:{' '}
                                <span className={`order-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                                {' | '}
                                <span className={`order-status ${order.isDelivered ? 'paid' : 'unpaid'}`}>
                                    {order.isDelivered ? 'Delivered' : 'Pending'}
                                </span>
                            </p>
                            <div className="order-items">
                                {order.items.map((item, i) => (
                                    <p key={i}>{item.name} x{item.quantity} - {formatPrice(item.price)}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
