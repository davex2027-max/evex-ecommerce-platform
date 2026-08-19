const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');
const validate = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/securityMiddleware');

router.post(
    '/register',
    authLimiter,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['user', 'advertiser', 'business_owner', 'admin']).withMessage('Invalid role'),
    ],
    validate,
    registerUser
);

router.post(
    '/login',
    authLimiter,
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    loginUser
);

module.exports = router;
