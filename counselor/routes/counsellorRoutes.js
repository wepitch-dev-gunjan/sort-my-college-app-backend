const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getCounsellors,
  editProfile,
  postReviewCounsellor,
  getCounsellor,
  getReviewsCounsellor,
  getProfilePic,
  uploadProfilePic,
  deleteProfilePic,
  getTotalRatings,
  deleteCounsellor,
  uploadCoverImage,
  verifyCounsellor,
  getCounsellorForAdmin,
  getCounsellorsForAdmin,
  rejectCounsellor,
  findOneCounsellor,
  getDashboardData,
  incrementActivityPoints,
} = require("../controllers/counsellorController");
const {
  counsellorAuth,
  userAuth,
  counsellorOrUserAuth,
  adminAuth,
  adminOrUserAuth,
  adminOrCounsellorAuth,
} = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadImage");

// GET
router.get("/", userAuth, getCounsellors);
router.get("/counsellor-for-admin", adminAuth, getCounsellorsForAdmin);
router.get("/:counsellor_id", counsellorOrUserAuth, getCounsellor);
router.get(
  "/:counsellor_id/counsellor-for-admin",
  adminAuth,
  getCounsellorForAdmin
);
router.get("/:counsellor_id/profile-pic", getProfilePic);
router.get(
  "/:counsellor_id/review",
  counsellorOrUserAuth,
  getReviewsCounsellor
);
router.get(
  "/:counsellor_id/total-rating",
  counsellorOrUserAuth,
  getTotalRatings
);
router.get("/counsellors/find-one", findOneCounsellor);
router.get("/dashboard/dashboard-data", counsellorAuth, getDashboardData);

// PUT
router.put("/:counsellor_id", adminOrCounsellorAuth, editProfile);
router.put("/:counsellor_id/verify", adminAuth, verifyCounsellor);
router.put("/:counsellor_id/reject", adminAuth, rejectCounsellor);
router.put("/activity/increment-activity-points", counsellorAuth, incrementActivityPoints)

// POST
router.post("/login", login);
router.post("/register", register);
router.post("/:counsellor_id/review", userAuth, postReviewCounsellor);
router.post(
  "/profile-pic",
  counsellorAuth,
  upload.single("image"),
  uploadProfilePic
);
router.post(
  "/cover-image",
  counsellorAuth,
  upload.single("image"),
  uploadCoverImage
);

// DELETE
router.delete("/:counsellor_id/profile-pic", counsellorAuth, deleteProfilePic);
router.delete("/:counsellor_id", adminAuth, deleteCounsellor);

module.exports = router;
