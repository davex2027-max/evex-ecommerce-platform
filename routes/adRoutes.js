const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAds, createAd, getMyAds, getAdById, updateAd, deleteAd } = require('../controllers/adController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const adValidation = [
    body('businessName').notEmpty().withMessage('Business name is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('contactPhone').notEmpty().withMessage('Contact phone is required'),
    body('imageUrl').notEmpty().withMessage('Image is required'),
];

router.get('/', getAds);
router.post('/', protect, adValidation, validate, createAd);
router.get('/my-ads', protect, getMyAds);
router.get('/:id', getAdById);
router.put('/:id', protect, updateAd);
router.delete('/:id', protect, deleteAd);

module.exports = router;
