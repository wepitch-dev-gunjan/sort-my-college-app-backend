const express = require("express");
const {
  getCourses,
  getAllCourses,
  addCourse,
  addCounsellorInCourse,
} = require("../controllers/courseController");
const router = express.Router();

router.get("/:counsellor_id/courses", getCourses);
router.get("/courses/allcourses", getAllCourses);
router.post("/courses", addCourse);
router.put("/:course_id/course", addCounsellorInCourse);

module.exports = router;
