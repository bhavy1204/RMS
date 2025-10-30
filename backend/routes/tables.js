const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { authenticate, authorize } = require('../middleware/auth');
const { qrLimiter, generalLimiter } = require('../middleware/rateLimiting');
const {
  validateTable,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/by-slug/:slug', generalLimiter, tableController.getTableBySlug);

// Protected routes
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), validatePagination, tableController.getTables);
router.get('/:id', authorize('admin'), validateObjectId('id'), tableController.getTable);
router.post('/', authorize('admin'), validateTable, tableController.createTable);
router.put('/:id', authorize('admin'), validateObjectId('id'), validateTable, tableController.updateTable);
router.delete('/:id', authorize('admin'), validateObjectId('id'), tableController.deleteTable);
router.patch('/:id/toggle-status', authorize('admin'), validateObjectId('id'), tableController.toggleTableStatus);

// QR code generation routes
router.get('/:id/qr', qrLimiter, authorize('admin'), validateObjectId('id'), tableController.generateQRCode);
router.get('/qr/bulk-generate', qrLimiter, authorize('admin'), tableController.bulkGenerateQRCodes);

module.exports = router;


