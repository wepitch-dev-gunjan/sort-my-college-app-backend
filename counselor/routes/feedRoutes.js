const express = require("express");
const {
  getFeeds,
  getFeed,
  createFeed,
  likeFeed,
  saveFeed,
  unsaveFeed,
  editFeed,
  unhideFeed,
  hideFeed,
  getLikes,
  unlikeFeed,
  deleteFeed,
} = require("../controllers/feedController");

const router = express.Router();

// GET
router.get("/:counsellor_id/feed", getFeeds);
router.get("/feed/:feed_id", getFeed);
router.get("/feed/:feed_id/likes", getLikes);

// PUT
router.put("/feed/:feed_id", editFeed);
router.put("/feed/:feed_id/hide", hideFeed);
router.put("/feed/:feed_id/unhide", unhideFeed);
router.put("/feed/:feed_id/like", likeFeed);
router.put("/feed/:feed_id/unlike", unlikeFeed);
router.put("/feed/:feed_id/save", saveFeed);
router.put("/feed/:feed_id/unsave", unsaveFeed);

// POST
router.post("/:counsellor_id/feed", createFeed);

// DELETE
router.delete("/feed/:feed_id", deleteFeed);

module.exports = router;
