const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);
router.post('/setup-2fa', authenticate, authController.setup2FA);
router.post('/enable-2fa', authenticate, authController.enable2FA);
router.get('/me', authenticate, authController.getMe);

module.exports = router;