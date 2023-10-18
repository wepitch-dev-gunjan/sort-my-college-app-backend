const express = require("express");
const {
  createCourseCategory,
  getCourseCategorys,
  getCourseCategory,
  deleteCourseCategory,
  editCourseCategory,
} = require("../controllers/courseCategoryControllers");
const router = express.Router();

router.post("/courseCategory", createCourseCategory);
router.get("/courseCategory", getCourseCategorys);
router.get("/courseCategory/:course_id", getCourseCategory);
router.delete("/courseCategory/:course_id", deleteCourseCategory);
router.put("/courseCategory/:course_id", editCourseCategory);

module.exports = router;
