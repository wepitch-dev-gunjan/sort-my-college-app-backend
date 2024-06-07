const express = require("express");
const {
  createOrder,
  createPayment,
  getPayments,
  getPayment,
  getOutstandingBalance,
  clearOutstandingbalance,
  paymentForCounsellor,
  incomeofcounsellor,
} = require("../controllers/paymentController");
const {
  counsellorOrUserAuth,
  counsellorAuth,
  userAuth,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/payments/create-order", counsellorOrUserAuth, createOrder);
router.post("/payments/create-payment", counsellorOrUserAuth, createPayment);
router.get("/payments", getPayments);
router.get("/payments/get-payment/:payment_id", getPayment);
router.get(
  "/payments/:counsellor_id/outstanding-balance",
  getOutstandingBalance
);
router.get("/payment/getincomeofcounsellor/:counsellor_id", incomeofcounsellor);
router.put(
  "/payments/:counsellor_id/outstanding-balance",
  clearOutstandingbalance
);
router.get(
  `/payment/payment-for-counsellor`,
  counsellorAuth,
  paymentForCounsellor
);

// user routes

module.exports = router;
