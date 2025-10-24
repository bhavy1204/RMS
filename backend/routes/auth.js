const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiting');
const {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', authLimiter, validateUserRegistration, authController.register);
router.post('/login', authLimiter, validateUserLogin, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);

module.exports = router;

