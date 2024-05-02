const express = require("express");
const {
  getCoursesForEp,
  addCourse,
  editCourse,
  deleteCourse,
  getCoursesForUser,
} = require("../controllers/entranceCourseControllers");
const {
  epAuth,
  adminAuth,
  userAuth,
} = require("../middlewares/authMiddleware");
// const { c

//  } = require("../controllers/entranceCourseControllers");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

// EP Panel Routes
router.get("/courses", epAuth, getCoursesForEp);
router.post("/courses",epAuth, addCourse);
router.put("/courses/:course_id", epAuth, editCourse);
router.delete("/courses/:course_id", epAuth, deleteCourse);

//  ADMIN Panel Routes
// router.get("/courses/admin", adminAuth, getCoursesForAdmin);
// router.post("/courses/admin", adminAuth, addCourseForAdmin);

// router.put("/courses/:course_id", adminAuth, editCourseForAdmin);
// router.delete("/courses/:course_id", adminAuth, deleteCourseForAdmin);

// Routes for USER
router.get("/coursesForUser/:institute_id", userAuth, getCoursesForUser);

module.exports = router;
