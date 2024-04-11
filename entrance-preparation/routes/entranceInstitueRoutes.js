const express = require("express");
const {
  epAuth,
  adminAuth,
  userAuth,
} = require("../middlewares/authMiddleware");
const {
  getProfile,
  editProfile,
  getInstitutesForAdmin,
  getInstituteForAdmin,
  editInstituteForAdmin,
  deleteInstituteForAdmin,
  getInstitutesForUser,
  getInstituteForUser,
  findOneInstitute,
} = require("../controllers/entranceInstituteControllers");
const router = express.Router();

// ep panel routes
router.get("/institute", epAuth, getProfile);
router.put("/institute", epAuth, editProfile);

// // admin panel routes
router.get("/institute/admin", adminAuth, getInstitutesForAdmin);
router.get("/institute/admin/:institute_id", adminAuth, getInstituteForAdmin);
router.put("/institute/admin/:institute_id", adminAuth, editInstituteForAdmin);
router.delete(
  "/institute/admin/:institute_id",
  adminAuth,
  deleteInstituteForAdmin
);
router.get("/institute/find-one", findOneInstitute);

// // user routes
router.get("/institute/user", userAuth, getInstitutesForUser);
router.get("/institute/user/:institute_id", userAuth, getInstituteForUser);
// router.get('/institute/user/:institute_id',userAuth, getInstituteForUser);

// router.put('/institute/user/:institute_id/follow',userAuth, followInstitute);
// router.put('/institute/user/:institute_id/unfollow',userAuth, unfollowInstitute);

module.exports = router;
