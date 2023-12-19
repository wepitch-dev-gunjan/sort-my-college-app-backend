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
} = require("../controllers/counsellorController");
const { counsellorAuth, userAuth, counsellorOrUserAuth, adminAuth } = require("../middlewares/authMiddleware");

// GET
router.get("/", userAuth, getCounsellors);
router.get("/:counsellor_id", counsellorOrUserAuth, getCounsellor);
router.get("/:counsellor_id/profile-pic", getProfilePic);
router.get("/:counsellor_id/review", getReviewsCounsellor);
router.get("/:counsellor_id/total-rating", getTotalRatings);

// PUT
router.put("/:counsellor_id", counsellorAuth, editProfile);

// POST
router.post("/login", login);
router.post("/register", register);
router.post("/:counsellor_id/review", userAuth, postReviewCounsellor);
router.post("/:counsellor_id/profile-pic", counsellorAuth, uploadProfilePic);

// DELETE
router.delete("/:counsellor_id/profile-pic", counsellorAuth, deleteProfilePic);
router.delete("/:counsellor_id", adminAuth, deleteCounsellor);

module.exports = router;
