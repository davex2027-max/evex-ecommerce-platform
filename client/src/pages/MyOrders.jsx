import { useState, useEffect } from 'react';
import API from '../api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/my-orders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="orders-page">
            <h2>My Orders</h2>
            {orders.length === 0 ? <p>No orders yet.</p> : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <h4>Order #{order._id.slice(-6)}</h4>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Total: ${order.totalPrice.toFixed(2)}</p>
                            <p>Payment: {order.paymentMethod.toUpperCase()}</p>
                            <p>Status: {order.isPaid ? 'Paid' : 'Unpaid'} | {order.isDelivered ? 'Delivered' : 'Pending'}</p>
                            <div className="order-items">
                                {order.items.map((item, i) => (
                                    <p key={i}>{item.name} x{item.quantity} - ${item.price.toFixed(2)}</p>
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
