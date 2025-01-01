const express = require("express");
const router = express.Router();
const { adminAuth, userAuth } = require("../middlewares/authMiddleware");
const {
  getAccommodationsForAdmin,
  addAccommodation,
  getAccommodationForAdmin,
  editAccommodation,
  deleteAccommodation,
  updateAccommodationStatus,
  getAccommodationsForUser,
  getCitiesForAccommodation,
  getNearbyCollegesForAccommodation
} = require("../controllers/accommodationController");
const { upload } = require("../middlewares/uploadImage");


// routes for admin
router.get("/accommodation", adminAuth, getAccommodationsForAdmin);
router.get("/accommodation/:accomodation_id", adminAuth, getAccommodationForAdmin);
router.put(
  "/accommodation/:accommodation_id/status",
  updateAccommodationStatus
);

// add Accommodation
router.post("/accommodation", adminAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 }
]), (req, res, next) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);
  next();
}, addAccommodation);

router.put("/accommodation/:accomodation_id", adminAuth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 }
]), (req, res, next) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);
  next();
}, editAccommodation);

router.delete(
  "/accommodation/:accomodation_id",
  adminAuth,
  deleteAccommodation
);

router.get("/accommodation/user/getallaccommodations", getAccommodationsForUser);

router.get("/accommodation/user/get-cities", getCitiesForAccommodation);
router.get("/accommodation/user/get-nearby-colleges", getNearbyCollegesForAccommodation);

module.exports = router;
