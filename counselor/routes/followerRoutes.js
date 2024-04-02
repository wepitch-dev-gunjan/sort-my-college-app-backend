const express = require("express");
const { userAuth, counsellorAuth } = require("../middlewares/authMiddleware");
const {
  followCounsellor,
  unfollowCounsellor,
  getFollowers,
  getFollowingCounsellorsForUser,
} = require("../controllers/followerController");
const router = express.Router();

// user routes
router.post("/follower/:counsellor_id", userAuth, followCounsellor);
router.put("/follower/:counsellor_id", userAuth, unfollowCounsellor);
router.get("/follower/get-counsellors-for-user", userAuth, getFollowingCounsellorsForUser);

// counsellor routes
router.get("/follower/followers", counsellorAuth, getFollowers);

module.exports = router;
