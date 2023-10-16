const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
} = require("../controllers/entranceCourseControllers");
const router = express.Router();

router.post("/course", createCourse);
router.get("/course", getCourses);
router.get("/course/:course_id", getCourse);
router.delete("/course/:course_id", deleteCourse);

module.exports = router;
