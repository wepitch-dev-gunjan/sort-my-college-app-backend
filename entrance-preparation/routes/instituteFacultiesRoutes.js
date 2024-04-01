const express = require("express");
const {
  getFaculties,
  addFaculties,
} = require("../controllers/facultiesControllers");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/addFaculties", upload.single("display_pic"), addFaculties);
router.get("/faculties", getFaculties);

module.exports = router;
