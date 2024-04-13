const express = require("express");
const {
  getFaculties,
  addFaculty,
  deleteFaculty,
  editFaculties,
} = require("../controllers/facultiesControllers");
const { epAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImage");
const router = express.Router();
//get APIs
router.get("/faculties",epAuth, getFaculties);

// post APIs
router.post("/addfaculties", epAuth,upload.single("display_pic"), addFaculty);

//Dlt APIs
router.delete("/faculties/:faculty_id", deleteFaculty);

// put Api
router.put("/editfaculties/:faculty_id", editFaculties);
module.exports = router;
