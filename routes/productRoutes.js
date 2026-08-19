const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const productValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('countInStock').isInt({ min: 0 }).withMessage('Count in stock must be a non-negative integer'),
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
];

router.get('/', getProducts);
router.post('/', protect, productValidation, validate, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post(
    '/:id/reviews',
    protect,
    [
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').notEmpty().withMessage('Comment is required'),
    ],
    validate,
    createProductReview
);

module.exports = router;
