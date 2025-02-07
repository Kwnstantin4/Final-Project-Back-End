const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const authenticate = require('../middleware/auth.middleware');







// GET: Όλες οι παραγγελίες χρήστη
router.get('/:userId', authenticate, ordersController.getUserOrders);



// Προστατευμένο route για δημιουργία παραγγελίας
router.post('/', authenticate,  ordersController.createOrder);


module.exports = router;
