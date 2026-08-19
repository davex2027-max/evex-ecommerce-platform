const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

router.post(
    '/',
    [
        body('paymentMethod').isIn(['stripe', 'paypal', 'cod']).withMessage('Invalid payment method'),
        body('shippingAddress.address').notEmpty().withMessage('Address is required'),
        body('shippingAddress.city').notEmpty().withMessage('City is required'),
        body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
        body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    ],
    validate,
    createOrder
);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.get('/', protect, admin, getAllOrders);

module.exports = router;
