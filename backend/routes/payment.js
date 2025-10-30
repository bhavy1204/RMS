const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

module.exports = router;
