const Order = require('../models/Order');
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder'
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

const createPaymentIntent = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
    }
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100),
            currency: 'usd',
            metadata: { orderId: order._id.toString() },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const stripeWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
    }
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: `Webhook Error: ${error.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: new Date(paymentIntent.created * 1000).toISOString(),
            };
            await order.save();
        }
    }

    res.json({ received: true });
};

module.exports = { createPaymentIntent, stripeWebhook };
