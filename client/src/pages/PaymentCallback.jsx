import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order');
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!orderId || !reference) {
            setStatus('error');
            setMessage('Missing payment details. Please check your order in My Orders.');
            return;
        }

        const verify = async () => {
            try {
                const { data } = await API.post(`/payment/${orderId}/verify`, { reference });
                if (data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Payment was not completed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Could not verify payment.');
            }
        };

        verify();
    }, [orderId, reference]);

    if (status === 'verifying') {
        return <LoadingSpinner text="Verifying your payment..." />;
    }

    return (
        <div className="checkout-page">
            <h2>{status === 'success' ? 'Payment Successful' : 'Payment Issue'}</h2>
            {status === 'success' ? (
                <>
                    <p>Thank you! Your payment was confirmed and your order is now marked as paid.</p>
                    <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        View My Orders
                    </Link>
                </>
            ) : (
                <>
                    <p>{message}</p>
                    <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Back to My Orders
                    </Link>
                </>
            )}
        </div>
    );
};

export default PaymentCallback;