const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price countInStock');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        for (const item of cart.items) {
            if (item.quantity > item.product.countInStock) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.product.name}`,
                });
            }
        }

        const items = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
        }));

        const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingPrice = itemsPrice > 500 ? 0 : 50;
        const taxPrice = itemsPrice * 0.1;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        for (const item of items) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { countInStock: -item.quantity } }
            );
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
};
