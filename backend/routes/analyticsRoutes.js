const express = require('express');
const router = express.Router();
const {
  getSellerAnalytics,
  getBuyerAnalytics,
  getPlatformAnalytics,
} = require('../controllers/analyticsController');
const { protect, isSeller, authorize } = require('../middleware/authMiddleware');

router.get('/seller', protect, isSeller, getSellerAnalytics);
router.get('/buyer', protect, getBuyerAnalytics);
router.get('/platform', protect, authorize('admin'), getPlatformAnalytics);

module.exports = router;
