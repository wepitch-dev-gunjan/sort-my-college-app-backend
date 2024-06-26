const express = require("express");
const {
  deleteBooking,
  getBooking,
  getBookings,
  editBooking,
  createBooking,
} = require("../controllers/bookingController");
const User = require("../models/User");
const { userAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/booking", createBooking);
router.put("/booking/:booking_id", editBooking);
router.get("/booking", userAuth, getBookings);
router.get("/booking/:booking_id", userAuth, getBooking);
router.delete("/booking/:booking_id", deleteBooking);

module.exports = router;
