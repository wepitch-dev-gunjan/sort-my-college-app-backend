const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware");
const { getEnquiries, addEnquiry } = require("../controllers/accommodationEnquiryController");

//post enquries
router.post("/accommodation/:accommodation_id/enquiry", adminAuth, addEnquiry);
//get enquries
router.get("/accommodation/:accommodation_id/enquiries", adminAuth,
  getEnquiries
);

module.exports = router;
