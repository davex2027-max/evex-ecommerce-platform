const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/pay', protect, createPaymentIntent);

module.exports = router;
