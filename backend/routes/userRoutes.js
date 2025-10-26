
const express = require('express');
const router = express.Router();
const {
  createSubscription,
  getCurrentSubscription,
  cancelSubscription,
  updateSubscription,
} = require('../controllers/subscriptionController');
const { protect, isSeller } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, isSeller, createSubscription);

router.get('/current', protect, isSeller, getCurrentSubscription);

router.route('/:id')
  .put(protect, isSeller, updateSubscription)
  .delete(protect, isSeller, cancelSubscription);

module.exports = router;
