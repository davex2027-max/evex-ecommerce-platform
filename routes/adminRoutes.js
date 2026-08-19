const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect, admin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put(
    '/:id/role',
    [body('role').isIn(['user', 'advertiser', 'business_owner', 'admin']).withMessage('Invalid role')],
    validate,
    updateUserRole
);
router.delete('/:id', deleteUser);

module.exports = router;
