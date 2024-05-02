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
const { upload } =require("../middlewares/uploadImage");
// routes for admin
router.get("/accommodation", adminAuth, getAccommodations);
router.get("/accommodation/:accomodation_id", adminAuth, getAccommodation);
// add Accommodation
router.post("/accommodation", adminAuth,upload.array("images"), addAccommodation);

router.put("/accommodation/:accomodation_id", adminAuth, editAccommodation);
router.delete(
  "/accommodation/:accomodation_id",
  adminAuth,
  deleteAccommodation
);

module.exports = router;
