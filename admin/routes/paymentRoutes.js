const express = require('express');
const { createOrder, createPayment } = require('../controllers/paymentController');
const { counsellorOrUserAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/payments/create-order', counsellorOrUserAuth, createOrder);
router.post('/payments/create-payment', counsellorOrUserAuth, createPayment);

module.exports = router;