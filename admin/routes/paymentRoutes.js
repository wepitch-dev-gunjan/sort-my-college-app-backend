const express = require("express");
const {
  createOrder,
  createPayment,
  getPayments,
  getPayment,
} = require("../controllers/paymentController");
const { counsellorOrUserAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/payments/create-order", counsellorOrUserAuth, createOrder);
router.post("/payments/create-payment", counsellorOrUserAuth, createPayment);
router.get("/payments", getPayments);
router.get("/payments/get-payment/:payment_id", getPayment);

module.exports = router;
