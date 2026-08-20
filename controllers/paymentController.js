const crypto = require('crypto');
const Order = require('../models/Order');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const CURRENCY = process.env.PAYSTACK_CURRENCY || 'NGN';

const isConfigured = () => Boolean(PAYSTACK_SECRET_KEY);

const paystackRequest = async (path, options = {}) => {
    const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();
    return { ok: response.ok, data };
};

const initializePayment = async (req, res) => {
    if (!isConfigured()) {
        return res.status(503).json({ message: "Paystack not configured" });
    }
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (order.isPaid) {
            return res.status(400).json({ message: "Order already paid" });
        }

        const user = await order.populate('user', 'name email');
        const email = user.user.email;

        const reference = `EVEX-${order._id}-${Date.now()}`;
        const callbackUrl = `${req.get('origin') || process.env.CORS_ORIGIN.split(',')[0]}/payment/callback?order=${order._id}`;

        const { ok, data } = await paystackRequest('/transaction/initialize', {
            method: 'POST',
            body: JSON.stringify({
                email,
                amount: Math.round(order.totalPrice * 100),
                currency: CURRENCY,
                reference,
                callback_url: callbackUrl,
                metadata: { orderId: order._id.toString() },
            }),
        });

        if (!ok) {
            console.error('Paystack initialize error:', data);
            return res.status(502).json({ message: data.message || "Failed to initialize payment" });
        }

        order.paymentResult = { id: reference, status: 'pending', update_time: new Date().toISOString() };
        await order.save();

        res.json({ authorization_url: data.data.authorization_url, reference });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const verifyPayment = async (req, res) => {
    if (!isConfigured()) {
        return res.status(503).json({ message: "Paystack not configured" });
    }
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const reference = req.body.reference || order.paymentResult.id;

        const { ok, data } = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);

        if (!ok) {
            console.error('Paystack verify error:', data);
            return res.status(502).json({ message: data.message || "Failed to verify payment" });
        }

        const transaction = data.data;

        if (transaction.status === 'success') {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: transaction.reference,
                status: transaction.status,
                update_time: new Date().toISOString(),
                email_address: transaction.customer?.email || '',
            };
            await order.save();
            return res.json({ success: true, order });
        }

        res.status(400).json({ success: false, message: transaction.gateway_response || "Payment not successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const paystackWebhook = async (req, res) => {
    if (!isConfigured()) {
        return res.status(503).json({ message: "Paystack not configured" });
    }

    const signature = req.headers['x-paystack-signature'];
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');

    if (!signature || signature !== hash) {
        return res.status(401).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'charge.success') {
        const reference = event.data?.reference;
        if (reference) {
            const order = await Order.findOne({ 'paymentResult.id': reference });
            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: reference,
                    status: 'success',
                    update_time: new Date().toISOString(),
                    email_address: event.data?.customer?.email || '',
                };
                await order.save();
            }
        }
    }

    res.json({ received: true });
};

module.exports = { initializePayment, verifyPayment, paystackWebhook };