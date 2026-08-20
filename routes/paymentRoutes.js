const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/pay', protect, initializePayment);
router.post('/:id/verify', protect, verifyPayment);

module.exports = router;