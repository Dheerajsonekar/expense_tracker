const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentControllers');
const authenticate = require('../middleware/auth');

router.get('/purchase/premium',authenticate, paymentController.createPremiumOrder);
router.get('/purchase/premium/:order_Id/:payment_session_id', authenticate, paymentController.updateOrderStatus);

module.exports = router;