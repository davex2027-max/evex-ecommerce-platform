const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price imageUrl countInStock');
        if (!cart) {
            return res.json({ user: req.user._id, items: [], totalPrice: 0 });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
            });
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const savedCart = await cart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find((item) => item.product.toString() === req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const savedCart = await cart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.id);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const savedCart = await cart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        cart.totalPrice = 0;

        const savedCart = await cart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
