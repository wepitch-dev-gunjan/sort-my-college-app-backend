const express = require("express");
const {
  createInstitute,
  getInstitutes,
  getInstitute,
  deleteInstitute,
} = require("../controllers/entranceInstituteControllers");
const router = express.Router();

router.post("/institute", createInstitute);
router.get("/institute", getInstitutes);
router.get("/institute/:institute_id", getInstitute);
router.delete("/institute/:institute_id", deleteInstitute);

module.exports = router;
