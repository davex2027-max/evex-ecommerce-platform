const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/', getCart);
router.post(
    '/add',
    [
        body('productId').isMongoId().withMessage('Valid product ID is required'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    validate,
    addToCart
);
router.put('/:id', [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')], validate, updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
