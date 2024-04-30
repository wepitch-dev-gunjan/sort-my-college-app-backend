const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware");
const {
  getAccommodations,
  addAccommodation,
  getAccommodation,
  editAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");

// routes for admin
router.get("/accommodation", adminAuth, getAccommodations);
router.get("/accommodation/:accomodation_id", adminAuth, getAccommodation);
router.post("/accommodation", adminAuth, addAccommodation);
router.put("/accommodation/:accomodation_id", adminAuth, editAccommodation);
router.delete(
  "/accommodation/:accomodation_id",
  adminAuth,
  deleteAccommodation
);

module.exports = router;
