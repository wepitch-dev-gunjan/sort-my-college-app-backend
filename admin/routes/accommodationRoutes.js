const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware");
const { getAccommodations, addAccommodation, getAccommodation } = require("../controllers/accommodationController");


// routes for admin
router.get("/accommodation", adminAuth, getAccommodations);
router.get("/accommodation/:accomodation_id", adminAuth, getAccommodation);
router.post("/accommodation", adminAuth, addAccommodation);

module.exports = router;
