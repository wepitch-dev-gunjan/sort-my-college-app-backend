const express = require("express");
const { userAuth, counsellorAuth } = require("../middlewares/authMiddleware");
const {
  followCounsellor,
  unfollowCounsellor,
  getFollowers,
} = require("../controllers/followerController");
const router = express.Router();

router.post("/follower/:counsellor_id", userAuth, followCounsellor);
router.put("/follower/:counsellor_id", userAuth, unfollowCounsellor);
router.get("/follower/followers", counsellorAuth, getFollowers);

module.exports = router;
