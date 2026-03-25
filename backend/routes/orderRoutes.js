const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToPaidAdmin,
    submitUPIUTR,
    updateOrderToConfirmed,
    updateOrderToShipped,
    updateOrderToOutForDelivery,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/submit-utr', protect, submitUPIUTR);
router.put('/:id/admin-pay', protect, admin, updateOrderToPaidAdmin);
router.put('/:id/confirm', protect, admin, updateOrderToConfirmed);
router.put('/:id/shipped', protect, admin, updateOrderToShipped);
router.put('/:id/out-for-delivery', protect, admin, updateOrderToOutForDelivery);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.get('/:id', protect, getOrderById);

module.exports = router;
