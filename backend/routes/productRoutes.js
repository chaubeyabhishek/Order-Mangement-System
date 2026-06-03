const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticate);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authorize('admin'), createProduct);
router.put('/:id', authorize('admin'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;
