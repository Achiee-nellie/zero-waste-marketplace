
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, isSeller, upload.array('images', 5), createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/seller/:sellerId', getSellerProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, isSeller, upload.array('images', 5), updateProduct)
  .delete(protect, isSeller, deleteProduct);

module.exports = router;
