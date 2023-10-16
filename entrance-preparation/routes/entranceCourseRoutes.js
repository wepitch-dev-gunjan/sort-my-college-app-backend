const express = require("express");
const {
  createCourse,
  getCourses,
} = require("../controllers/entranceCourseControllers");
const router = express.Router();

router.post("/course", createCourse);
router.get("/course", getCourses);

module.exports = router;
