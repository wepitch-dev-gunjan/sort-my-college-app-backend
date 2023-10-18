const express = require("express");
const {
  createInstitute,
  getInstitutes,
  getInstitute,
  deleteInstitute,
  editInstitute,
  sendEnquiry,
} = require("../controllers/entranceInstituteControllers");
const router = express.Router();

router.post("/institute", createInstitute);
router.get("/institute", getInstitutes);
router.get("/institute/:institute_id", getInstitute);

router.delete("/institute/:institute_id", deleteInstitute);
router.put("/institute/:institute_id", editInstitute);

router.post("/institute/enquiry", sendEnquiry);

module.exports = router;
