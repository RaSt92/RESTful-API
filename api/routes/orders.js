const express = require('express');
const router =  express.Router();
const checkAuth = require('../middleware/check-auth');

const ordersController = require('../controllers/orders');
//handle incoming get requests to /orders
router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', checkAuth, ordersController.orders_create_order);
router.get('/:orderId', checkAuth, ordersController.orders_get_order);
router.delete('/:orderID',checkAuth, ordersController.orders_delete_order);
module.exports = router;