const express = require("express");
const {
  getFaculties,
  addFaculties,
  deleteFaculty,
} = require("../controllers/facultiesControllers");
const upload = require("../middlewares/uploadImage");
const router = express.Router();
//get APIs
router.get("/faculties", getFaculties);

// post APIs
router.post("/addfaculties", upload.single("display_pic"), addFaculties);

//Dlt APIs
router.delete("/faculties/:faculty_id", deleteFaculty);

module.exports = router;
