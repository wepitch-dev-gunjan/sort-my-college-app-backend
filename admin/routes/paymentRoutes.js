const express = require('express');
const { postPayment } = require('../controllers/paymentController');
const router = express.Router();

router.post('/payments/post-payment', postPayment);

module.exports = router;