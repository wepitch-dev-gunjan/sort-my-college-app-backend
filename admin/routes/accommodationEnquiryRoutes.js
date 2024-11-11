const express = require("express");
const router = express.Router();
const { adminAuth, userAuth, userAuthNew } = require("../middlewares/authMiddleware");
const { getEnquiries, addEnquiry, getAccommodationEnquiries } = require("../controllers/accommodationEnquiryController");

//post enquries
router.post("/accommodation/:accommodation_id/enquiry", userAuthNew, addEnquiry);
router.get("/accommodation/enquiries", getAccommodationEnquiries);

////////////////////////////////////////////////////////////////////////////
//get enquries
router.get("/accommodation/:accommodation_id/enquiries", adminAuth,
  getEnquiries
);

module.exports = router;
