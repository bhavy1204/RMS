const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate unique slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Calculate tax
const calculateTax = (subtotal, taxRate = 0.10) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

// Calculate total
const calculateTotal = (subtotal, tax = 0) => {
  return Math.round((subtotal + tax) * 100) / 100;
};

// Generate order number
const generateOrderNumber = async (Order) => {
  const count = await Order.countDocuments();
  return `ORD-${String(count + 1).padStart(6, '0')}`;
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Format date
const formatDate = (date, format = 'short') => {
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date));
};

// Pagination helper
const getPaginationInfo = (page, limit, totalCount) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const totalPages = Math.ceil(totalCount / limitNum);
  
  return {
    currentPage: pageNum,
    totalPages,
    totalItems: totalCount,
    itemsPerPage: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  };
};

// Error response helper
const createErrorResponse = (message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return { response, statusCode };
};

// Success response helper
const createSuccessResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return { response, statusCode };
};

// Async handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  generateRandomString,
  generateSlug,
  formatCurrency,
  calculateTax,
  calculateTotal,
  generateOrderNumber,
  isValidEmail,
  sanitizeInput,
  formatDate,
  getPaginationInfo,
  createErrorResponse,
  createSuccessResponse,
  asyncHandler
};

