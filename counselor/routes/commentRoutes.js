const express = require("express");
const {
  editFeedComment,
  hideFeedComment,
  unhideFeedComment,
  deleteFeedComment,
  postFeedComment,
  getFeedComments,
  getFeedComment,
} = require("../controllers/commentController");
const router = express.Router();

//post
router.post("/feed/:feed_id/comment", postFeedComment);

//get
router.get("/feed/:feed_id/comments", getFeedComments);
router.get("/feed/:feed_id/comment", getFeedComment);

// PUT
router.put("/comment/:comment_id", editFeedComment);
router.put("/comment/:comment_id/hide", hideFeedComment);
router.put("/comment/:comment_id/unhide", unhideFeedComment);

router.delete("/comment/:comment_id", deleteFeedComment);
module.exports = router;
