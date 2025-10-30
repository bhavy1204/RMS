const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { orderLimiter, generalLimiter } = require('../middleware/rateLimiting');
const {
  validateOrder,
  validateOrderStatus,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes (with optional authentication for guest orders)
router.post('/', orderLimiter, optionalAuth, validateOrder, orderController.createOrder);

// Protected routes
router.use(authenticate);

// Customer routes
router.get('/me', validatePagination, orderController.getMyOrders);
router.get('/me/:id', validateObjectId('id'), orderController.getOrder);
router.patch('/me/:id/cancel', validateObjectId('id'), authorize('customer'), orderController.cancelOrder);

// Staff and Admin routes
router.get('/', authorize('staff', 'admin'), validatePagination, orderController.getOrders);
router.get('/:id', authorize('staff', 'admin'), validateObjectId('id'), orderController.getOrder);
router.patch('/:id/status', authorize('staff', 'admin'), validateObjectId('id'), validateOrderStatus, orderController.updateOrderStatus);

// Admin only routes
router.get('/analytics/overview', authorize('admin'), orderController.getOrderAnalytics);

module.exports = router;


