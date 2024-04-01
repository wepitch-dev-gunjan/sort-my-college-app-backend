const express = require("express");
const {
  getFaculties,
  addFaculties,
} = require("../controllers/facultiesControllers");
const router = express.Router();

router.post("/addFaculties", addFaculties);
router.get("/faculties", getFaculties);

module.exports = router;
