import { useState, useEffect } from 'react';
import API from '../api';

const AdminPanel = () => {
    const [tab, setTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin');
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/orders');
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'users') fetchUsers();
        else fetchOrders();
    }, [tab]);

    const updateRole = async (id, role) => {
        try {
            await API.put(`/admin/${id}/role`, { role });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    const deleteUser = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await API.delete(`/admin/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    const markDelivered = async (id) => {
        try {
            await API.put(`/orders/${id}/deliver`);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    return (
        <div className="admin-page">
            <h2>Admin Panel</h2>
            <div className="admin-tabs">
                <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
                <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    {tab === 'users' && (
                        <table className="admin-table">
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}>
                                                <option value="user">User</option>
                                                <option value="advertiser">Advertiser</option>
                                                <option value="business_owner">Business Owner</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === 'orders' && (
                        <div className="orders-list">
                            {orders.length === 0 ? <p>No orders.</p> : orders.map((order) => (
                                <div key={order._id} className="order-card">
                                    <h4>Order #{order._id.slice(-6)}</h4>
                                    <p>User: {order.user?.name} ({order.user?.email})</p>
                                    <p>Total: ${order.totalPrice.toFixed(2)}</p>
                                    <p>Status: {order.isPaid ? 'Paid' : 'Unpaid'} | {order.isDelivered ? 'Delivered' : 'Pending'}</p>
                                    {!order.isDelivered && (
                                        <button className="btn btn-sm btn-primary" onClick={() => markDelivered(order._id)}>Mark Delivered</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;
