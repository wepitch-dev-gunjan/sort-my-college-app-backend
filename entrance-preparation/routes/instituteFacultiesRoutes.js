const express = require("express");
const {
  getFaculties,
  addFaculties,
  deleteFaculty,
  editFaculties,
} = require("../controllers/facultiesControllers");
const { epAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImage");
const router = express.Router();
//get APIs
router.get("/faculties", getFaculties);

// post APIs
router.post("/addfaculties", upload.single("display_pic"), addFaculties);

//Dlt APIs
router.delete("/faculties/:faculty_id", deleteFaculty);
// put Api
router.put("/editfaculties/:faculty_id" , editFaculties)
module.exports = router;
