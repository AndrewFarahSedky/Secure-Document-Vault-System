const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id/role', authenticate, authorize('admin'), adminController.updateUserRole);
router.delete('/users/:id', authenticate, authorize('admin'), adminController.deleteUser);

module.exports = router;