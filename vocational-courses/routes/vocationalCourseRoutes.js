const express = require("express");
const {
  createVocationalCourse,
  getVocationalCourses,
  getVocationalCourse,
  deleteVocationalCourse,
  editVocationalCourse,
} = require("../controllers/vocationalCourseControllers");
const router = express.Router();

router.post("/vocationalcourse", createVocationalCourse);
router.get("/vocationalcourse", getVocationalCourses);
router.get("/vocationalcourse/:course_id", getVocationalCourse);
router.delete("/vocationalcourse/:course_id", deleteVocationalCourse);
router.put("/vocationalcourse/:course_id", editVocationalCourse);

module.exports = router;
