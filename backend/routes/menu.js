const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiting');
const {
  validateMenuCategory,
  validateMenuItem,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const { uploadSingle } = require('../utils/fileUpload');

// Public routes (no authentication required)
router.get('/categories', generalLimiter, menuController.getCategories);
router.get('/items', generalLimiter, validatePagination, menuController.getMenuItems);
router.get('/items/:id', generalLimiter, validateObjectId('id'), menuController.getMenuItem);

// Protected routes for staff and admin
router.use(authenticate);

// Category management (Admin only)
router.post('/categories', authorize('admin'), validateMenuCategory, menuController.createCategory);
router.put('/categories/:id', authorize('admin'), validateObjectId('id'), validateMenuCategory, menuController.updateCategory);
router.delete('/categories/:id', authorize('admin'), validateObjectId('id'), menuController.deleteCategory);

// Menu item management (Admin only)
router.post('/items', authorize('admin'), uploadSingle('image'), validateMenuItem, menuController.createMenuItem);
router.put('/items/:id', authorize('admin'), validateObjectId('id'), uploadSingle('image'), validateMenuItem, menuController.updateMenuItem);
router.delete('/items/:id', authorize('admin'), validateObjectId('id'), menuController.deleteMenuItem);

// Availability toggle (Staff and Admin)
router.patch('/items/:id/toggle-availability', authorize('staff', 'admin'), validateObjectId('id'), menuController.toggleAvailability);

// Analytics (Admin only)
router.get('/analytics', authorize('admin'), menuController.getMenuAnalytics);

module.exports = router;


