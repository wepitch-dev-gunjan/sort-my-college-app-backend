const express = require("express");
const { createAccommodationFeedback, getAccommodationFeedbacks } = require("../controllers/accommodationFeedbackController");
const { userAuthNew } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-accommodation-feedback", userAuthNew, createAccommodationFeedback);
router.get("/get-accommodation-feedbacks/:accommodation_id", getAccommodationFeedbacks);

module.exports = router;