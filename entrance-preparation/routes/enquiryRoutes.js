const express = require("express")
const {
    epAuth,
    adminAuth,
    userAuth
} = require("../middlewares/authMiddlewares");

const {

} = require("../controllers/enquiryControllers")

const router = express.Router();


// EP Panel Routes 
router.post("/enquiry", epAuth, addEnquiry)