const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/admin/stats', admin, getDashboardStats);
router.get('/:id', getOrder);
router.put('/:id/status', admin, updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;