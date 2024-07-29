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
  EnquiryStatusChangeToReplies,
  getEnquiriesForAdmin,
  getSingleEnquiryForAdmin,
  changeStatus,
  getAllEnquiriesForAdmin,
} = require("../controllers/enquiryControllers");

const router = express.Router();

// EP Panel Routes
router.post("/enquiry", userAuth, addEnquiry);

//Get
router.get("/enquiries", epAuth, getEnquiries);
router.get("/singleEnqury/:enquiry_id", epAuth, getSingleEnquiry);
router.put("/singleEnqury/:enquiry_id", epAuth, EnquiryStatusChangeToReplies);


// admin Route
router.get("/enquiriesForAdmin/:institute_id",adminAuth, getEnquiriesForAdmin)
router.get("/allEnquiriesForAdmin",adminAuth, getAllEnquiriesForAdmin)
router.get("/singleEnquiryForAdmin/:enquiry_id" , adminAuth,getSingleEnquiryForAdmin);
router.put("/changeStatus/:enquiry_id",adminAuth,changeStatus);
module.exports = router;
