const express = require("express");
const {
  epAuth,
  adminAuth,
  userAuth,
} = require("../middlewares/authMiddleware");

const {
  addEnquiry,
  getEnquiries,
  getSingleEnquiry,
} = require("../controllers/enquiryControllers");

const router = express.Router();

// EP Panel Routes
router.post("/enquiry", userAuth, addEnquiry);

//Get
router.get("/enquiries", epAuth, getEnquiries);
router.get("/singleEnqury/:enquiry_id", epAuth, getSingleEnquiry);

module.exports = router;
