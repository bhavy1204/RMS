const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['customer', 'staff', 'admin'])
    .withMessage('Role must be customer, staff, or admin'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Menu category validation rules
const validateMenuCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters'),
  body('displayOrder')
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  handleValidationErrors
];

// Menu item validation rules
const validateMenuItem = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('categoryId')
    .isMongoId()
    .withMessage('Category ID must be a valid MongoDB ObjectId'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('preparationTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Preparation time must be at least 1 minute'),
  body('calories')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories must be a non-negative integer'),
  handleValidationErrors
];

// Table validation rules
const validateTable = [
  body('number')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Table number must be between 1 and 20 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacity must be between 1 and 20'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Location cannot exceed 50 characters'),
  handleValidationErrors
];

// Order validation rules
const validateOrder = [
  body('tableId')
    .isMongoId()
    .withMessage('Table ID must be a valid MongoDB ObjectId'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItemId')
    .isMongoId()
    .withMessage('Each item must have a valid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have a quantity of at least 1'),
  body('items.*.note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Item note cannot exceed 200 characters'),
  body('specialInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special instructions cannot exceed 500 characters'),
  handleValidationErrors
];

// Order status validation
const validateOrderStatus = [
  body('status')
    .isIn(['placed', 'preparing', 'ready', 'served', 'canceled'])
    .withMessage('Status must be one of: placed, preparing, ready, served, canceled'),
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateMenuCategory,
  validateMenuItem,
  validateTable,
  validateOrder,
  validateOrderStatus,
  validateObjectId,
  validatePagination
};


