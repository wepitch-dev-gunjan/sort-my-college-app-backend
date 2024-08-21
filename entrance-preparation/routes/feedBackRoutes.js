const express = require("express");
const { userAuth, epAuth } = require("../middlewares/authMiddleware");
const {
  createFeedback,
  getFeedbacks,
  getReviewsForEp,
} = require("../controllers/feedbackController");
const router = express.Router();

router.post("/feedback", userAuth, createFeedback);
router.get("/feedbacks/getall/:institute_id", getFeedbacks);

router.get("/reviews", epAuth, getReviewsForEp);

module.exports = router;