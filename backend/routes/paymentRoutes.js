
const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleWebhook,
  refundPayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/create-intent', protect, paymentLimiter, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/:id/refund', protect, authorize('admin'), refundPayment);

module.exports = router;
