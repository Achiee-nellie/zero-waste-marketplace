
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getSellerOrders,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, isSeller } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder);

router.get('/myorders', protect, getMyOrders);
router.get('/seller', protect, isSeller, getSellerOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, isSeller, updateOrderToDelivered);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
