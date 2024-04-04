const express = require("express")
const {
    epAuth,
    adminAuth,
    userAuth
} = require("../middlewares/authMiddleware");

const {
    addEnquiry
} = require("../controllers/enquiryControllers")

const router = express.Router();


// EP Panel Routes 
router.post("/enquiry", epAuth, addEnquiry);

module.exports = router