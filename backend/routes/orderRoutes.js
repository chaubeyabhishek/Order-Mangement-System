const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  setPrice,
  confirmOrder,
  updateStatus,
  deleteOrder,
} = require('../controllers/orderController');

router.post('/', authenticate, createOrder);
router.get('/mine', authenticate, getUserOrders);
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.put('/:id/price', authenticate, authorize('admin'), setPrice);
router.put('/:id/status', authenticate, authorize('admin'), updateStatus);
router.put('/:id/confirm', authenticate, confirmOrder);
router.delete('/:id', authenticate, authorize('admin'), deleteOrder);

module.exports = router;
