const express = require('express');
const { createOrder, createPayment, getPayments } = require('../controllers/paymentController');
const { counsellorOrUserAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/payments/create-order', counsellorOrUserAuth, createOrder);
router.post('/payments/create-payment', counsellorOrUserAuth, createPayment);
router.get('/payments/create-payment', counsellorOrUserAuth, getPayments);

module.exports = router;