const express = require("express");
const {
  getFaculties,
  addFaculty,
  deleteFaculty,
  editFaculties,
  getFacultiesForUser,
} = require("../controllers/facultiesControllers");
const { epAuth, userAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();
//get APIs
router.get("/faculties", epAuth, getFaculties);

// post APIs
router.post("/addfaculties", epAuth, upload.single("display_pic"), addFaculty);

//Dlt APIs
router.delete("/faculties/:faculty_id", deleteFaculty);

// put Api
router.put("/editfaculties/:faculty_id", editFaculties);

// users
router.get("/facultiesForUsers/:institute_id", userAuth, getFacultiesForUser);

module.exports = router;  
