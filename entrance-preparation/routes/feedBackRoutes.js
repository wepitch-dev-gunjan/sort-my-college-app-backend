const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const {
  createFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");
const router = express.Router();

router.post("/feedback", userAuth, createFeedback);
router.get("/feedbacks/getall/:institute_id", getFeedbacks);
module.exports = router;