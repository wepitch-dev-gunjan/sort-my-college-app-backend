const express = require("express");
const {
  createOrder,
  createPayment,
  getPayments,
  getPayment,
  getOutstandingBalance,
  clearOutstandingbalance,
} = require("../controllers/paymentController");
const { counsellorOrUserAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/payments/create-order", counsellorOrUserAuth, createOrder);
router.post("/payments/create-payment", counsellorOrUserAuth, createPayment);
router.get("/payments", getPayments);
router.get("/payments/get-payment/:payment_id", getPayment);
router.get('/payments/:counsellor_id/outstanding-balance', getOutstandingBalance)
router.put('/payments/:counsellor_id/outstanding-balance', clearOutstandingbalance)

module.exports = router;
